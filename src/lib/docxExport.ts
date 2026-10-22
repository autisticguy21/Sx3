import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { CurriculumModule, computeCurriculumStats } from '../data/curriculumData.ts';
import { RepositoryItem } from '../data/repoCatalog.ts';
import { REPO_STUDY_GUIDES } from '../data/repoStudyGuide.ts';

/**
 * Generates and downloads a rich, professional .docx syllabus document
 * containing the full 7,200-hour engineering curriculum, progress tracking,
 * indexed repositories (including Haystack and Robusta), study guides, and reproduction roadmaps.
 */
export async function generateCurriculumDocx(
  modules: CurriculumModule[],
  repositories: RepositoryItem[],
  customTitle = 'B69 7,200-Hour Autonomous AI & Systems Engineering Curriculum'
): Promise<Blob> {
  const stats = computeCurriculumStats(modules);

  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  };

  // 1. Cover / Title Section
  const paragraphs: (Paragraph | Table)[] = [
    new Paragraph({
      text: customTitle,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200, before: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Comprehensive Autonomous AI Agent & Systems Engineering Syllabus',
          italics: true,
          size: 24,
          color: '555555',
        }),
      ],
      spacing: { after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Generated Date: ', bold: true }),
        new TextRun({ text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }),
        new TextRun({ text: '  |  Target Budget: ', bold: true }),
        new TextRun({ text: '7,200 Hours across 25 Foundational & Frontier Modules' }),
      ],
      spacing: { after: 400 },
    }),

    // Executive Progress Section
    new Paragraph({
      text: 'Student Completion Progress Summary',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 300, after: 150 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: '• Total Curriculum Budget: ', bold: true }),
        new TextRun({ text: `${stats.totalHours.toLocaleString()} Hours (Exact Zero-Inflation Budget)\n` }),
        new TextRun({ text: '• Completed Hours: ', bold: true }),
        new TextRun({ text: `${stats.completedHours.toLocaleString()} Hours (${stats.completedPercent}%)\n` }),
        new TextRun({ text: '• In-Progress Hours: ', bold: true }),
        new TextRun({ text: `${stats.inProgressHours.toLocaleString()} Hours (${stats.inProgressPercent}%)\n` }),
        new TextRun({ text: '• Remaining Hours: ', bold: true }),
        new TextRun({ text: `${stats.remainingHours.toLocaleString()} Hours\n` }),
        new TextRun({ text: '• Module Breakdown: ', bold: true }),
        new TextRun({
          text: `${stats.completedModulesCount} Completed, ${stats.inProgressModulesCount} In Progress, ${stats.notStartedModulesCount} Backlog out of ${stats.totalModulesCount} total modules`,
        }),
      ],
      spacing: { after: 300 },
    }),

    // Stage Progress Summary Table
    new Paragraph({
      text: 'Curriculum Stages Overview',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 150 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Stage', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Domain Title', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Hours', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Completion', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
          ],
        }),
        ...stats.stageBreakdown.map(
          (st) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: st.stage })],
                  borders: tableBorder,
                }),
                new TableCell({
                  children: [new Paragraph({ text: st.stageName })],
                  borders: tableBorder,
                }),
                new TableCell({
                  children: [new Paragraph({ text: `${st.totalHours}h` })],
                  borders: tableBorder,
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      text: `${st.percent}% (${st.completedHours}h done, ${st.inProgressHours}h in progress)`,
                    }),
                  ],
                  borders: tableBorder,
                }),
              ],
            })
        ),
      ],
    }),

    // Detailed Module Breakdown
    new Paragraph({
      text: '25-Module Master Curriculum Specification',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
  ];

  // Append each module with objectives and tools
  modules.forEach((mod) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${mod.id}: ${mod.title}`, bold: true, size: 26 }),
          new TextRun({ text: ` [${mod.stage} · ${mod.hours}h · Status: ${mod.completionStatus.toUpperCase()}]`, color: '0066CC', bold: true }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Harness Role: ', bold: true }),
          new TextRun({ text: mod.harnessRole }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Curricular Goal: ', bold: true }),
          new TextRun({ text: mod.goal }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Description: ', bold: true }),
          new TextRun({ text: mod.description }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Key Demanded Tools: ', bold: true }),
          new TextRun({ text: (mod.keyTools || []).join(', ') || 'Standard CLI' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Demanded Materials & Textbooks: ', bold: true }),
          new TextRun({ text: (mod.demandedMaterials || []).join('; ') || 'Standard literature' }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Prerequisites: ', bold: true }),
          new TextRun({ text: mod.prerequisites.join(', ') }),
        ],
        spacing: { after: 150 },
      })
    );
  });

  // Repository Section
  paragraphs.push(
    new Paragraph({
      text: 'Indexed Open-Source Repositories & Harness Components',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 150 },
    }),
    new Paragraph({
      text: 'Canonical repositories matching curriculum requirements with >=70% subject correlation, >=4,000 stars, or verified educational exemption.',
      spacing: { after: 200 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Repository', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Mod', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Stars', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Match', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Harness Layer / Role', bold: true })] })],
              borders: tableBorder,
              shading: { fill: 'F0F4F8' },
            }),
          ],
        }),
        ...repositories.slice(0, 45).map(
          (repo) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: repo.name })],
                  borders: tableBorder,
                }),
                new TableCell({
                  children: [new Paragraph({ text: repo.module })],
                  borders: tableBorder,
                }),
                new TableCell({
                  children: [new Paragraph({ text: repo.stars.toLocaleString() })],
                  borders: tableBorder,
                }),
                new TableCell({
                  children: [new Paragraph({ text: `${repo.correlationScore}%` })],
                  borders: tableBorder,
                }),
                new TableCell({
                  children: [new Paragraph({ text: repo.harnessLayer })],
                  borders: tableBorder,
                }),
              ],
            })
        ),
      ],
    })
  );

  // Curated Study Guides Section (highlighting Haystack, Robusta, Karpathy, etc.)
  paragraphs.push(
    new Paragraph({
      text: 'Deep Study Guides & Reproduction Specifications',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 150 },
    }),
    new Paragraph({
      text: 'Each featured tool includes 2 non-overlapping complementary textbooks with specific assigned chapters, multi-university video lectures (ETH Zurich, Chinese universities with English subs, US elite), and an alternative-language reproduction roadmap.',
      spacing: { after: 200 },
    })
  );

  const featuredKeys = Object.keys(REPO_STUDY_GUIDES);
  featuredKeys.forEach((key) => {
    const guide = REPO_STUDY_GUIDES[key];
    paragraphs.push(
      new Paragraph({
        text: `Repository Study Guide: ${guide.repoName} [${guide.module}]`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Complementary Book 1: ', bold: true }),
          new TextRun({ text: `${guide.book1.title} (${guide.book1.author}, ${guide.book1.year}) — Chapters: ${guide.book1.selectedChapters.join(', ')}. Focus: ${guide.book1.focusDomain}.\n` }),
          new TextRun({ text: 'Complementary Book 2 (Non-Overlapping): ', bold: true }),
          new TextRun({ text: `${guide.book2.title} (${guide.book2.author}, ${guide.book2.year}) — Chapters: ${guide.book2.selectedChapters.join(', ')}. Focus: ${guide.book2.focusDomain}.\n` }),
          new TextRun({ text: 'Non-Overlap Rationale: ', bold: true, italics: true }),
          new TextRun({ text: `${guide.book2.nonOverlappingRationale}\n` }),
          new TextRun({ text: 'Reproduction Roadmap: ', bold: true }),
          new TextRun({ text: `Source: ${guide.reproductionRoadmap.sourceLanguage} -> Target: ${guide.reproductionRoadmap.targetLanguage}. Skills: ${guide.reproductionRoadmap.prerequisiteSkills.join(', ')}.\n` }),
          new TextRun({ text: `Milestones: 1) ${guide.reproductionRoadmap.phase1Foundation} 2) ${guide.reproductionRoadmap.phase2CorePrimitives} 3) ${guide.reproductionRoadmap.phase3HarnessIntegration} 4) ${guide.reproductionRoadmap.phase4BenchmarkAndParity}` }),
        ],
        spacing: { after: 200 },
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Triggers a browser download of the generated DOCX file.
 */
export async function downloadCurriculumDocx(
  modules: CurriculumModule[],
  repositories: RepositoryItem[],
  filename?: string
): Promise<void> {
  const blob = await generateCurriculumDocx(modules, repositories);
  const name = filename || `Curriculum-7200H-Autonomous-AI-${new Date().toISOString().split('T')[0]}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
