import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { CURRICULUM_MODULES } from '../data/curriculumData.ts';
import { REPOSITORY_DATABASE, RepositoryItem } from '../data/repoCatalog.ts';
import {
  exportToGoogleSheets,
  exportToGoogleDocs,
  createGoogleDriveFolder,
  scheduleCalendarMilestone,
  downloadCSV,
  downloadJSON,
  WorkspaceExportResult,
} from '../lib/workspaceExport.ts';
import { ConfirmationModal } from './ConfirmationModal.tsx';
import {
  FileSpreadsheet,
  FileText,
  FolderPlus,
  Calendar,
  Download,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

interface WorkspaceExportViewProps {
  user: User | null;
  accessToken: string | null;
  onSignIn: () => void;
}

export const WorkspaceExportView: React.FC<WorkspaceExportViewProps> = ({
  user,
  accessToken,
  onSignIn,
}) => {
  const [activeExporting, setActiveExporting] = useState<string | null>(null);
  const [exportResults, setExportResults] = useState<Record<string, WorkspaceExportResult>>({});

  // Confirmation modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    affectedCount?: number;
    actionType: 'sheets' | 'docs' | 'drive' | 'calendar' | null;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: null,
  });

  // Calendar configuration state
  const [calendarTitle, setCalendarTitle] = useState('B69 Checkpoint: NM28 Higher Harness Stack');
  const [calendarDesc, setCalendarDesc] = useState('Study milestone review for MCP tool schemas and agent sandbox verification.');
  const [calendarDate, setCalendarDate] = useState('2026-11-01T10:00:00');

  // Trigger Confirmation Modals (Mandatory User Consent)
  const requestExportSheets = () => {
    setModalConfig({
      isOpen: true,
      title: 'Export to Google Sheets',
      description:
        'This will create a new multi-tab Google Spreadsheet in your Google Drive titled "B69 AI Curriculum & Correlated Repos (7,200h)" with 4 structured sheets. Do you wish to continue?',
      affectedCount: REPOSITORY_DATABASE.length,
      actionType: 'sheets',
    });
  };

  const requestExportDocs = () => {
    setModalConfig({
      isOpen: true,
      title: 'Generate Google Docs Syllabus',
      description:
        'This will generate a comprehensive B69 curriculum study guide and repository breakdown document directly in your Google Docs. Do you wish to continue?',
      affectedCount: CURRICULUM_MODULES.length,
      actionType: 'docs',
    });
  };

  const requestCreateDriveFolder = () => {
    setModalConfig({
      isOpen: true,
      title: 'Create Google Drive Workspace Folder',
      description:
        'This will create a dedicated folder titled "B69 AI Engineering Curriculum" inside your Google Drive root directory to organize all exported artifacts. Do you wish to continue?',
      actionType: 'drive',
    });
  };

  const requestScheduleCalendar = () => {
    setModalConfig({
      isOpen: true,
      title: 'Schedule Google Calendar Milestone',
      description: `This will schedule the event "${calendarTitle}" on your primary Google Calendar at the specified date. Do you wish to proceed?`,
      actionType: 'calendar',
    });
  };

  const handleConfirmAction = async () => {
    const action = modalConfig.actionType;
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

    if (!accessToken) {
      alert('Please connect your Google account first using Sign in with Google.');
      return;
    }

    if (action === 'sheets') {
      setActiveExporting('sheets');
      const res = await exportToGoogleSheets(accessToken, REPOSITORY_DATABASE, CURRICULUM_MODULES);
      setExportResults((prev) => ({ ...prev, sheets: res }));
      setActiveExporting(null);
    } else if (action === 'docs') {
      setActiveExporting('docs');
      const res = await exportToGoogleDocs(accessToken, REPOSITORY_DATABASE, CURRICULUM_MODULES);
      setExportResults((prev) => ({ ...prev, docs: res }));
      setActiveExporting(null);
    } else if (action === 'drive') {
      setActiveExporting('drive');
      const res = await createGoogleDriveFolder(accessToken, 'B69 AI Engineering Curriculum');
      setExportResults((prev) => ({ ...prev, drive: res }));
      setActiveExporting(null);
    } else if (action === 'calendar') {
      setActiveExporting('calendar');
      const endIso = new Date(new Date(calendarDate).getTime() + 60 * 60 * 1000).toISOString();
      const res = await scheduleCalendarMilestone(accessToken, {
        title: calendarTitle,
        description: calendarDesc,
        startIso: new Date(calendarDate).toISOString(),
        endIso,
      });
      setExportResults((prev) => ({ ...prev, calendar: res }));
      setActiveExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        affectedCount={modalConfig.affectedCount}
        confirmLabel="Authorize & Export"
        cancelLabel="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Header */}
      <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <FileSpreadsheet className="w-4 h-4" />
          <span>GOOGLE WORKSPACE CLIENT-SIDE EXPORT SUITE</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Export to Google Sheets, Docs, Drive &amp; Calendar
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Directly synchronize the 7,200-hour engineering curriculum, &gt;=70% correlated repository matrix, and Higher Harness Stack into your Google Workspace account with full user consent and explicit confirmation.
        </p>
      </div>

      {/* Auth Status Card */}
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono text-slate-400">Google Workspace Connection Status</div>
          <div className="text-sm font-bold text-white mt-0.5 flex items-center space-x-2">
            {user ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Connected as {user.displayName || user.email}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Not Connected — Click below to authorize Google Workspace</span>
              </>
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            Scopes: drive.file · spreadsheets · documents · calendar.events
          </div>
        </div>

        {!user && (
          <button
            onClick={onSignIn}
            className="flex items-center space-x-2 bg-white text-slate-800 hover:bg-slate-100 px-4 py-2 rounded text-xs font-medium border border-slate-300 transition shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        )}
      </div>

      {/* Workspace Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Google Sheets */}
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Google Sheets Workbook</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates a 4-tab spreadsheet: 7,200h hour accounting syllabus, &gt;=70% correlated repo catalog, Higher Harness stack architecture, and lecture links.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={requestExportSheets}
              disabled={activeExporting === 'sheets' || !user}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white py-2 px-3 rounded text-xs font-medium transition"
            >
              {activeExporting === 'sheets' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Building Spreadsheet...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export to Google Sheets</span>
                </>
              )}
            </button>

            {exportResults.sheets?.success && (
              <a
                href={exportResults.sheets.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 text-xs text-emerald-400 hover:underline pt-1"
              >
                <span>Open Created Spreadsheet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {exportResults.sheets?.error && (
              <div className="text-[11px] font-mono text-red-400">
                {exportResults.sheets.error}
              </div>
            )}
          </div>
        </div>

        {/* 2. Google Docs */}
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sky-400">
              <FileText className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Google Docs Study Syllabus</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates a formatted syllabus document with learning objectives, reading guides, Higher Harness specifications, and repository breakdowns.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={requestExportDocs}
              disabled={activeExporting === 'docs' || !user}
              className="w-full flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white py-2 px-3 rounded text-xs font-medium transition"
            >
              {activeExporting === 'docs' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Document...</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Google Doc</span>
                </>
              )}
            </button>

            {exportResults.docs?.success && (
              <a
                href={exportResults.docs.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 text-xs text-sky-400 hover:underline pt-1"
              >
                <span>Open Created Document</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {exportResults.docs?.error && (
              <div className="text-[11px] font-mono text-red-400">
                {exportResults.docs.error}
              </div>
            )}
          </div>
        </div>

        {/* 3. Google Drive */}
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400">
              <FolderPlus className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Google Drive Folder Organization</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Creates a dedicated folder titled &quot;B69 AI Engineering Curriculum&quot; inside your Google Drive to house all exported sheets, syllabus documents, and milestone notes.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={requestCreateDriveFolder}
              disabled={activeExporting === 'drive' || !user}
              className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white py-2 px-3 rounded text-xs font-medium transition"
            >
              {activeExporting === 'drive' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Folder...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create Drive Folder</span>
                </>
              )}
            </button>

            {exportResults.drive?.success && (
              <a
                href={exportResults.drive.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 text-xs text-amber-400 hover:underline pt-1"
              >
                <span>Open Drive Folder</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* 4. Google Calendar */}
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-purple-400">
              <Calendar className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">Google Calendar Study Milestone</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Schedule milestone checkpoints and study review sessions into your Google Calendar with automated reminders.
            </p>

            <div className="space-y-1.5 pt-1 text-xs font-mono">
              <label htmlFor="calendar-event-title-input" className="text-slate-400 text-[11px] block">Event Title:</label>
              <input
                id="calendar-event-title-input"
                type="text"
                value={calendarTitle}
                onChange={(e) => setCalendarTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"
              />
              <label htmlFor="calendar-date-time-input" className="text-slate-400 text-[11px] block">Target Date &amp; Time:</label>
              <input
                id="calendar-date-time-input"
                type="datetime-local"
                value={calendarDate}
                onChange={(e) => setCalendarDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={requestScheduleCalendar}
              disabled={activeExporting === 'calendar' || !user}
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-2 px-3 rounded text-xs font-medium transition"
            >
              {activeExporting === 'calendar' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule in Calendar</span>
                </>
              )}
            </button>

            {exportResults.calendar?.success && (
              <a
                href={exportResults.calendar.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 text-xs text-purple-400 hover:underline pt-1"
              >
                <span>View Scheduled Event</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Offline Download Fallbacks */}
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div>
          <div className="font-bold text-slate-200">Offline Fallback Exports</div>
          <div className="text-slate-500 text-[11px]">
            Download local structured files directly without Google authentication.
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => downloadCSV(REPOSITORY_DATABASE)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded transition border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download CSV (544 Repos)</span>
          </button>
          <button
            onClick={() => downloadJSON(CURRICULUM_MODULES, REPOSITORY_DATABASE)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded transition border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Download Complete JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
