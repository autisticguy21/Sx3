import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { CURRICULUM_MODULES } from '../data/curriculumData.ts';
import { REPOSITORY_DATABASE } from '../data/repoCatalog.ts';
import {
  exportToGoogleSheets,
  exportToGoogleDocs,
  createGoogleDriveFolder,
  scheduleCalendarMilestone,
  downloadCSV,
  downloadJSON,
  WorkspaceExportResult,
} from '../lib/workspaceExport.ts';
import { openGooglePicker, listGoogleDriveFiles, PickedFile } from '../lib/googlePicker.ts';
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
  Search,
  Sparkles,
  RefreshCw,
  FolderOpen,
  FileCode,
  HardDrive,
  FileDown,
} from 'lucide-react';
import { downloadCurriculumDocx } from '../lib/docxExport.ts';

interface WorkspaceExportViewProps {
  user: User | null;
  accessToken: string | null;
  onSignIn: () => void;
  onAnalyzeFileInGemini?: (file: PickedFile) => void;
}

export const WorkspaceExportView: React.FC<WorkspaceExportViewProps> = ({
  user,
  accessToken,
  onSignIn,
  onAnalyzeFileInGemini,
}) => {
  const [activeExporting, setActiveExporting] = useState<string | null>(null);
  const [exportResults, setExportResults] = useState<Record<string, WorkspaceExportResult>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

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
  const [calendarDate, setCalendarDate] = useState('2026-11-01T10:00:00');

  // Google Picker & Drive Files state
  const [pickedFiles, setPickedFiles] = useState<PickedFile[]>([]);
  const [isPickerLoading, setIsPickerLoading] = useState(false);
  const [isDriveListing, setIsDriveListing] = useState(false);

  // Auto-dismiss notifications after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Open Google Picker modal
  const handleOpenPicker = async () => {
    if (!accessToken) {
      setNotification({
        type: 'info',
        message: 'Please connect your Google account first to open your Drive files with Google Picker.',
      });
      return;
    }

    setIsPickerLoading(true);
    try {
      await openGooglePicker(
        accessToken,
        (file) => {
          setPickedFiles((prev) => {
            const exists = prev.some((f) => f.id === file.id);
            if (exists) return prev;
            return [file, ...prev];
          });
          setNotification({
            type: 'success',
            message: `Selected "${file.name}" via Google Picker.`,
          });
        },
        () => {
          // User cancelled picker
        },
      );
    } catch (err: any) {
      console.error('Google Picker error:', err);
      setNotification({
        type: 'error',
        message: `Google Picker: ${err?.message || 'Could not open picker in this window.'}`,
      });
    } finally {
      setIsPickerLoading(false);
    }
  };

  // Direct fetch files from Google Drive REST API
  const handleFetchDriveFiles = async () => {
    if (!accessToken) {
      setNotification({
        type: 'info',
        message: 'Please connect your Google account first to list Google Drive files.',
      });
      return;
    }

    setIsDriveListing(true);
    try {
      const files = await listGoogleDriveFiles(accessToken);
      setPickedFiles((prev) => {
        const map = new Map<string, PickedFile>();
        files.forEach((f) => map.set(f.id, f));
        prev.forEach((f) => map.set(f.id, f));
        return Array.from(map.values());
      });
      setNotification({
        type: 'success',
        message: `Retrieved ${files.length} recent files from your Google Drive account.`,
      });
    } catch (err: any) {
      console.error('Fetch Drive files error:', err);
      setNotification({
        type: 'error',
        message: `Google Drive API: ${err?.message || 'Failed to list drive files'}`,
      });
    } finally {
      setIsDriveListing(false);
    }
  };

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
      setNotification({
        type: 'info',
        message: 'Please connect your Google account first using Sign in with Google.',
      });
      return;
    }

    if (action === 'sheets') {
      setActiveExporting('sheets');
      const res = await exportToGoogleSheets(accessToken, REPOSITORY_DATABASE, CURRICULUM_MODULES);
      setExportResults((prev) => ({ ...prev, sheets: res }));
      setActiveExporting(null);
      if (res.success) {
        setNotification({
          type: 'success',
          message: 'Google Spreadsheet successfully created and populated in Drive.',
        });
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to export to Sheets' });
      }
    } else if (action === 'docs') {
      setActiveExporting('docs');
      const res = await exportToGoogleDocs(accessToken, REPOSITORY_DATABASE, CURRICULUM_MODULES);
      setExportResults((prev) => ({ ...prev, docs: res }));
      setActiveExporting(null);
      if (res.success) {
        setNotification({
          type: 'success',
          message: 'Google Docs Study Syllabus successfully generated.',
        });
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to generate Google Doc' });
      }
    } else if (action === 'drive') {
      setActiveExporting('drive');
      const res = await createGoogleDriveFolder(accessToken, 'B69 AI Engineering Curriculum');
      setExportResults((prev) => ({ ...prev, drive: res }));
      setActiveExporting(null);
      if (res.success) {
        setNotification({
          type: 'success',
          message: 'Google Drive folder "B69 AI Engineering Curriculum" created.',
        });
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to create Drive folder' });
      }
    } else if (action === 'calendar') {
      setActiveExporting('calendar');
      const startDate = new Date(calendarDate);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
      const res = await scheduleCalendarMilestone(accessToken, {
        title: calendarTitle,
        description: 'Study milestone review for B69 engineering curriculum.',
        startIso: startDate.toISOString(),
        endIso: endDate.toISOString(),
      });
      setExportResults((prev) => ({ ...prev, calendar: res }));
      setActiveExporting(null);
      if (res.success) {
        setNotification({
          type: 'success',
          message: 'Milestone scheduled in your Google Calendar.',
        });
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to schedule calendar event' });
      }
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

      {/* Inline Notification Banner */}
      {notification && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between animate-in fade-in duration-150 ${
            notification.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : notification.type === 'error'
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              : 'bg-sky-950/60 border-sky-500/40 text-sky-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {notification.type === 'info' && <HardDrive className="w-4 h-4 text-sky-400" />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white text-xs underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <FileSpreadsheet className="w-4 h-4" />
          <span>GOOGLE WORKSPACE &amp; GOOGLE PICKER INTEGRATION</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Google Drive Picker, Sheets, Docs &amp; Calendar Export Suite
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Browse and select your Google Drive files with Google Picker, or export the 7,200-hour engineering curriculum, &gt;=70% correlated repository matrix, and Higher Harness Stack into your Google Workspace account with explicit user confirmation.
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
            Scopes: drive.file · drive.metadata.readonly · spreadsheets · documents · calendar.events
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

      {/* SECTION: Google Picker & Drive Files Explorer */}
      <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-sky-500/30 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400 font-bold uppercase">
              <FolderOpen className="w-4 h-4" />
              <span>Google Picker &amp; Drive File Explorer</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Select or Attach Files from Google Drive
            </h3>
            <p className="text-xs text-slate-300">
              Launch the official Google Picker modal to browse your Google Drive spreadsheets, syllabus notes, and code artifacts, or view recent files below.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleOpenPicker}
              disabled={isPickerLoading || !user}
              className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white px-4 py-2 rounded text-xs font-semibold shadow-md transition"
            >
              {isPickerLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Opening Picker...</span>
                </>
              ) : (
                <>
                  <FolderOpen className="w-4 h-4" />
                  <span>Launch Google Picker</span>
                </>
              )}
            </button>

            <button
              onClick={handleFetchDriveFiles}
              disabled={isDriveListing || !user}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 px-3 py-2 rounded text-xs font-mono border border-slate-700 transition"
              title="Sync recent files directly from Google Drive"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isDriveListing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Drive</span>
            </button>
          </div>
        </div>

        {/* Picked Files Table / List */}
        {pickedFiles.length > 0 ? (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Drive Artifacts &amp; Picked Files ({pickedFiles.length})</span>
              <button
                onClick={() => setPickedFiles([])}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline"
              >
                Clear List
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg divide-y divide-slate-850 overflow-hidden">
              {pickedFiles.map((f) => (
                <div key={f.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50 transition">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 rounded bg-slate-900 text-sky-400 shrink-0">
                      {f.mimeType.includes('spreadsheet') ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      ) : f.mimeType.includes('document') ? (
                        <FileText className="w-4 h-4 text-sky-400" />
                      ) : f.mimeType.includes('folder') ? (
                        <FolderPlus className="w-4 h-4 text-amber-400" />
                      ) : (
                        <FileCode className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate max-w-sm sm:max-w-md">
                        {f.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 truncate flex items-center space-x-2">
                        <span>ID: {f.id.slice(0, 12)}...</span>
                        <span>·</span>
                        <span className="truncate max-w-[150px]">{f.mimeType.replace('application/vnd.google-apps.', '')}</span>
                        {f.sizeBytes && <span>· {(f.sizeBytes / 1024).toFixed(1)} KB</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 transition"
                    >
                      <span>Open in Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {onAnalyzeFileInGemini && (
                      <button
                        onClick={() => onAnalyzeFileInGemini(f)}
                        className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 bg-purple-950/40 hover:bg-purple-900/60 px-2.5 py-1 rounded border border-purple-800/40 transition"
                        title="Analyze with Gemini Lab"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>Analyze</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-950/60 border border-dashed border-slate-800 rounded-lg text-center space-y-1">
            <div className="text-xs text-slate-400">No Google Drive files picked yet.</div>
            <div className="text-[11px] text-slate-500">
              Click &quot;Launch Google Picker&quot; above to select your spreadsheets, docs, or upload learning materials from Google Drive.
            </div>
          </div>
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadCurriculumDocx(CURRICULUM_MODULES, REPOSITORY_DATABASE)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition shadow-sm font-semibold"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Word (.docx) Syllabus</span>
          </button>
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
