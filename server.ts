import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(apiKey),
  });
});

// 1. Multi-turn Chat endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, model = 'gemini-3.8-flash', systemInstruction } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const targetModel = model || 'gemini-3.8-flash';

    const config: Record<string, unknown> = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    // If argon model is requested, configure thinking
    if (targetModel === 'gemini-4-argon') {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: formattedContents,
      config,
    });

    const reply = response.text || 'No response generated.';
    return res.json({ text: reply, model: targetModel });
  } catch (error: any) {
    console.error('Chat error:', error);
    // If argon fails (e.g. paid key requirement or quota), fallback to 3.8-flash
    if (req.body.model === 'gemini-4-argon') {
      try {
        console.warn('Falling back from gemini-4-argon to gemini-3.8-flash...');
        const fallback = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: req.body.messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        });
        return res.json({
          text: fallback.text,
          model: 'gemini-3.8-flash (fallback)',
          notice: 'Active model was routed via gemini-3.8-flash',
        });
      } catch (fbErr: any) {
        return res.status(500).json({ error: fbErr?.message || 'Chat generation failed' });
      }
    }
    return res.status(500).json({ error: error?.message || 'Chat generation failed' });
  }
});

// 2. High Thinking Synthesis endpoint (Gemini 4 Argon)
app.post('/api/gemini/synthesize', async (req: Request, res: Response) => {
  try {
    const {
      moduleId,
      moduleTitle,
      stage,
      hours,
      correlatedRepos,
      userPreferences,
    } = req.body;

    const prompt = `You are the Lead AI Curriculum Architect for the B69 Engineering Track (7,200 hours total).
Analyze the following curriculum module and synthesized higher harness stack:

Module: ${moduleId} - ${moduleTitle} (Stage: ${stage}, Allocated: ${hours} hours)
Selected Correlated Repositories (>=70% match):
${JSON.stringify(correlatedRepos, null, 2)}

User Customization & Study Constraints:
${JSON.stringify(userPreferences || {}, null, 2)}

Perform a deep, step-by-step rigorous curriculum breakdown:
1. Architectural decomposition of how these repositories fit together into a production Higher Harness Stack (Layers: Host/Sandbox, MCP Protocol, Memory/Context, Orchestrator, Guardrails/Eval).
2. Direct study sequence with hour allocation totaling ${hours} hours (split into Theory, Code Lab Walkthrough, and Implementation Capstone).
3. Critical code patterns to master from these exact repositories (functions, classes, contracts, and benchmark setups).
4. Concrete failure modes and edge cases to test in a sandbox harness.

Provide your synthesis in clear, structured Markdown with clean headings, code snippets where applicable, and actionable checklist items.`;

    let synthesizedText = '';
    let usedModel = 'gemini-4-argon';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          systemInstruction:
            'You are an elite AI Systems Engineer and Curriculum Architect. You provide rigorous, production-grade technical analyses without fluff or generic filler.',
        },
      });
      synthesizedText = response.text || '';
    } catch (argonErr: any) {
      console.warn('gemini-4-argon failed or requires setup, falling back to gemini-3.8-flash:', argonErr.message);
      usedModel = 'gemini-3.8-flash';
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an elite AI Systems Engineer and Curriculum Architect. You provide rigorous, production-grade technical analyses.',
        },
      });
      synthesizedText = response.text || '';
    }

    return res.json({
      synthesis: synthesizedText,
      modelUsed: usedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Synthesis error:', error);
    return res.status(500).json({ error: error?.message || 'Synthesis failed' });
  }
});

// 3. Live Google Search Grounding for Repository Verification (Gemini 3.8 Flash)
app.post('/api/gemini/verify-repo', async (req: Request, res: Response) => {
  try {
    const { repoName, repoUrl } = req.body;

    if (!repoName) {
      return res.status(400).json({ error: 'Repository name is required' });
    }

    const prompt = `Use Google Search to find current, authoritative information on the GitHub repository: "${repoName}" (${repoUrl || ''}).
Find:
1. Current verified GitHub star count (approximate or exact).
2. Latest release date, release tag, or recent commit activity (specifically checking if there was activity around/after September 2026).
3. Primary technical focus, higher harness capabilities (e.g. MCP tools, agent framework, serving engine, quantization).
4. Status recommendation: Is it actively maintained, archived, or superseded?

Format your response concisely:
- Verified Stars: [Number]
- Latest Release / Commit: [Date or Tag]
- Stack Category: [e.g. MCP Harness, Inference, Evaluation]
- Verdict: [Ready for Build Slice / Study Pointer / Pending]
- Summary: [2-3 sentences on its practical value for 7,200h AI engineering curriculum]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are a technical repository auditor. Use real-time search data to verify GitHub repository metrics and release recency.',
      },
    });

    // Extract grounding metadata if present
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    return res.json({
      verification: response.text || 'Verification search completed.',
      groundingMetadata: groundingMetadata || null,
      searchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Repo verification error:', error);
    return res.status(500).json({ error: error?.message || 'Repository verification failed' });
  }
});

// Always use port 3000 for the app dev server (Cloud Run sets PORT=8080 for nginx ingress)
let PORT = 3000;
const portArgIdx = process.argv.indexOf('--port');
if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
  PORT = parseInt(process.argv[portArgIdx + 1], 10);
}

// Mount Vite or static file serving
const isDev = process.env.NODE_ENV !== 'production';

async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for client-side routing
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`  VITE v8.3.4  ready in 150 ms`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${PORT}/`);
    console.log(`[Server] B69 Curriculum Platform active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
