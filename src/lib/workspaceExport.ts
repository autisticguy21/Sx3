import { CURRICULUM_MODULES, CurriculumModule } from '../data/curriculumData.ts';
import { RepositoryItem } from '../data/repoCatalog.ts';
import { HIGHER_HARNESS_STACK } from '../data/harnessStack.ts';
import { MEDIA_RESOURCES } from '../data/mediaCatalog.ts';

export interface WorkspaceExportResult {
  service: 'sheets' | 'docs' | 'drive' | 'calendar';
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
  message: string;
}

/**
 * Creates an interactive multi-tab Google Sheets workbook
 */
export async function exportToGoogleSheets(
  accessToken: string,
  repos: RepositoryItem[],
  modules: CurriculumModule[] = CURRICULUM_MODULES,
): Promise<WorkspaceExportResult> {
  try {
    // 1. Create Spreadsheet with defined sheet titles
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `B69 AI Curriculum & Correlated Repos (7,200h) - ${new Date().toISOString().split('T')[0]}`,
        },
        sheets: [
          { properties: { title: '7200h Curriculum Modules', sheetId: 0 } },
          { properties: { title: 'Correlated Repos (>=70%)', sheetId: 1 } },
          { properties: { title: 'Higher Harness Stack', sheetId: 2 } },
          { properties: { title: 'Lectures & Textbooks', sheetId: 3 } },
        ],
      }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json();
      throw new Error(errData?.error?.message || 'Failed to create Google Spreadsheet');
    }

    const created = await createRes.json();
    const spreadsheetId = created.spreadsheetId;

    // 2. Prepare Tab 1: Curriculum Modules
    const tab1Values = [
      ['Module ID', 'Stage', 'Stage Name', 'Title', 'Hours', 'Harness Role', 'Core Goal', 'Prerequisites'],
      ...modules.map((m) => [
        m.id,
        m.stage,
        m.stageName,
        m.title,
        m.hours,
        m.harnessRole,
        m.goal,
        m.prerequisites.join(', '),
      ]),
      ['TOTAL', '', '', '', 7200, '', 'Complete 7,200-hour engineering curriculum', ''],
    ];

    // 3. Prepare Tab 2: Correlated Repositories
    const tab2Values = [
      ['Module', 'Repository Name', 'Stars', 'Stars Source', 'Status', 'Correlation Index', 'Harness Layer', 'GitHub URL', 'Description'],
      ...repos.map((r) => [
        r.module,
        r.name,
        r.stars,
        r.starsSource,
        r.status,
        `${r.correlationScore}%`,
        r.harnessLayer,
        r.url,
        r.description,
      ]),
    ];

    // 4. Prepare Tab 3: Higher Harness Stack
    const tab3Values = [
      ['Layer Number', 'Layer Name', 'Protocol / Standard', 'Primary Repositories', 'Key Challenge', 'Module Mapping'],
      ...HIGHER_HARNESS_STACK.map((l) => [
        `Layer ${l.layerNumber}`,
        l.name,
        l.protocolStandard,
        l.primaryRepos.join(', '),
        l.keyChallenge,
        l.moduleMapping.join(', '),
      ]),
    ];

    // 5. Prepare Tab 4: Multimedia Resources
    const tab4Values = [
      ['Module', 'Type', 'Title', 'Provider', 'Length / Duration', 'URL', 'Description'],
      ...MEDIA_RESOURCES.map((m) => [
        m.moduleId,
        m.type,
        m.title,
        m.provider,
        m.durationOrLength,
        m.url,
        m.description,
      ]),
    ];

    // 6. Push data in batch to spreadsheet
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: [
            { range: "'7200h Curriculum Modules'!A1", values: tab1Values },
            { range: "'Correlated Repos (>=70%)'!A1", values: tab2Values },
            { range: "'Higher Harness Stack'!A1", values: tab3Values },
            { range: "'Lectures & Textbooks'!A1", values: tab4Values },
          ],
        }),
      },
    );

    if (!updateRes.ok) {
      console.warn('Batch update values warning, but spreadsheet was created');
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    return {
      service: 'sheets',
      success: true,
      url: spreadsheetUrl,
      id: spreadsheetId,
      message: 'Successfully exported to Google Sheets with 4 comprehensive tabs.',
    };
  } catch (error: any) {
    console.error('Export to Google Sheets error:', error);
    return {
      service: 'sheets',
      success: false,
      error: error?.message || 'Error communicating with Google Sheets API',
      message: 'Failed to create spreadsheet.',
    };
  }
}

/**
 * Creates a structured Google Docs study syllabus
 */
export async function exportToGoogleDocs(
  accessToken: string,
  repos: RepositoryItem[],
  modules: CurriculumModule[] = CURRICULUM_MODULES,
): Promise<WorkspaceExportResult> {
  try {
    const title = `B69 AI Engineering Curriculum & Study Syllabus (7,200h)`;
    const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json();
      throw new Error(errData?.error?.message || 'Failed to create Google Doc');
    }

    const created = await createRes.json();
    const documentId = created.documentId;

    // Generate formatted syllabus text
    let syllabusContent = `B69 AI ENGINEERING CURRICULUM SYLLABUS\nTotal Allocated Hours: 7,200 Hours across Stages N0 to N11\nGenerated on: ${new Date().toLocaleDateString()}\n\n`;

    syllabusContent += `=== 1. CURRICULUM STAGES & MODULE BREAKDOWN ===\n\n`;
    for (const mod of modules) {
      syllabusContent += `[${mod.id}] ${mod.title} (${mod.stage} - ${mod.stageName})\n`;
      syllabusContent += `Allocated: ${mod.hours}h | Harness Role: ${mod.harnessRole}\n`;
      syllabusContent += `Learning Goal: ${mod.goal}\n`;
      syllabusContent += `Prerequisites: ${mod.prerequisites.join(', ')}\n\n`;
    }

    syllabusContent += `\n=== 2. HIGHER HARNESS STACK ARCHITECTURE ===\n\n`;
    for (const layer of HIGHER_HARNESS_STACK) {
      syllabusContent += `${layer.name}\n`;
      syllabusContent += `Standard: ${layer.protocolStandard}\n`;
      syllabusContent += `Role: ${layer.role}\n`;
      syllabusContent += `Key Challenge: ${layer.keyChallenge}\n`;
      syllabusContent += `Primary Repos: ${layer.primaryRepos.join(', ')}\n\n`;
    }

    syllabusContent += `\n=== 3. TOP CORRELATED REPOSITORIES (>=70% MATCH) ===\n\n`;
    const topRepos = repos.slice(0, 30);
    for (const repo of topRepos) {
      syllabusContent += `- ${repo.name} [${repo.module}] (${repo.stars.toLocaleString()} stars · ${repo.correlationScore}% match)\n`;
      syllabusContent += `  Status: ${repo.status} | Layer: ${repo.harnessLayer}\n`;
      syllabusContent += `  URL: ${repo.url}\n`;
      syllabusContent += `  Summary: ${repo.description}\n\n`;
    }

    // Insert text into document
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: syllabusContent,
            },
          },
        ],
      }),
    });

    const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    return {
      service: 'docs',
      success: true,
      url: docUrl,
      id: documentId,
      message: 'Successfully generated complete Study Syllabus in Google Docs.',
    };
  } catch (error: any) {
    console.error('Export to Google Docs error:', error);
    return {
      service: 'docs',
      success: false,
      error: error?.message || 'Error communicating with Google Docs API',
      message: 'Failed to create document.',
    };
  }
}

/**
 * Creates a dedicated curriculum folder in Google Drive
 */
export async function createGoogleDriveFolder(
  accessToken: string,
  folderName: string = 'B69 AI Engineering Curriculum',
): Promise<WorkspaceExportResult> {
  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || 'Failed to create Google Drive folder');
    }

    const data = await res.json();
    const folderUrl = `https://drive.google.com/drive/folders/${data.id}`;
    return {
      service: 'drive',
      success: true,
      url: folderUrl,
      id: data.id,
      message: `Created Google Drive folder "${folderName}".`,
    };
  } catch (error: any) {
    console.error('Google Drive error:', error);
    return {
      service: 'drive',
      success: false,
      error: error?.message || 'Error communicating with Google Drive API',
      message: 'Failed to create Google Drive folder.',
    };
  }
}

/**
 * Schedules a milestone review study session in Google Calendar
 */
export async function scheduleCalendarMilestone(
  accessToken: string,
  eventData: {
    title: string;
    description: string;
    startIso: string;
    endIso: string;
  },
): Promise<WorkspaceExportResult> {
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: eventData.title,
        description: eventData.description,
        start: { dateTime: eventData.startIso },
        end: { dateTime: eventData.endIso },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'email', minutes: 1440 }, // 1 day before
          ],
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || 'Failed to schedule event in Google Calendar');
    }

    const data = await res.json();
    return {
      service: 'calendar',
      success: true,
      url: data.htmlLink,
      id: data.id,
      message: `Milestone scheduled in Google Calendar: "${eventData.title}".`,
    };
  } catch (error: any) {
    console.error('Google Calendar error:', error);
    return {
      service: 'calendar',
      success: false,
      error: error?.message || 'Error communicating with Google Calendar API',
      message: 'Failed to schedule calendar event.',
    };
  }
}

/**
 * Client-side CSV Download fallback
 */
export function downloadCSV(repos: RepositoryItem[], filename = 'b69_correlated_repos.csv') {
  const headers = ['Module', 'Name', 'Stars', 'StarsSource', 'Status', 'CorrelationScore', 'HarnessLayer', 'URL', 'Description'];
  const rows = repos.map((r) => [
    `"${r.module}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    r.stars,
    `"${r.starsSource}"`,
    `"${r.status}"`,
    `${r.correlationScore}%`,
    `"${r.harnessLayer}"`,
    `"${r.url}"`,
    `"${r.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Client-side JSON Download fallback
 */
export function downloadJSON(
  modules: CurriculumModule[],
  repos: RepositoryItem[],
  filename = 'b69_curriculum_catalog.json',
) {
  const data = {
    meta: {
      title: 'B69 Curriculum & Repo Intelligence Platform',
      totalHours: 7200,
      minCorrelationThreshold: '70%',
      exportedAt: new Date().toISOString(),
    },
    modules,
    higherHarnessStack: HIGHER_HARNESS_STACK,
    repositories: repos,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
