declare const gapi: any;
declare const google: any;

export interface PickedFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
  sizeBytes?: number;
  lastEditedUtc?: number;
  iconUrl?: string;
  description?: string;
}

/**
 * Loads the Google API client script dynamically if not already present
 */
function ensureGapiScriptLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof gapi !== 'undefined') {
      return resolve();
    }
    const existing = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(new Error('Failed to load Google API script')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google API script'));
    document.head.appendChild(script);
  });
}

/**
 * Opens the Google Picker dialog configured with Google Drive, Sheets, Docs, and Upload views.
 * Requires an authenticated Google Workspace OAuth access token.
 */
export async function openGooglePicker(
  accessToken: string,
  onPicked: (file: PickedFile) => void,
  onCancel?: () => void,
): Promise<void> {
  await ensureGapiScriptLoaded();

  return new Promise((resolve, reject) => {
    if (typeof gapi === 'undefined') {
      return reject(new Error('Google API client is not available in the current browser window.'));
    }

    gapi.load('picker', () => {
      try {
        if (!google?.picker?.PickerBuilder) {
          return reject(new Error('Google Picker library could not be loaded. Please ensure popup and script permissions are active.'));
        }

        // Standard origin handling compatible with nested iframe runtime
        const origin = window.location.origin;

        // View 1: Google Docs & General Drive files
        const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false);

        // View 2: Google Spreadsheets
        const sheetsView = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
          .setIncludeFolders(true);

        // View 3: Direct Upload to Google Drive
        const uploadView = new google.picker.DocsUploadView();

        const builder = new google.picker.PickerBuilder()
          .setTitle('Select Google Drive Curriculum Artifacts & Repos')
          .addView(docsView)
          .addView(sheetsView)
          .addView(uploadView)
          .setOAuthToken(accessToken)
          .setOrigin(origin)
          .setCallback((data: any) => {
            if (data.action === google.picker.Action.PICKED) {
              const doc = data.docs?.[0];
              if (doc) {
                onPicked({
                  id: doc.id,
                  name: doc.name,
                  mimeType: doc.mimeType,
                  url: doc.url || `https://drive.google.com/file/d/${doc.id}/view`,
                  sizeBytes: doc.sizeBytes,
                  lastEditedUtc: doc.lastEditedUtc,
                  iconUrl: doc.iconUrl,
                  description: doc.description,
                });
              }
              resolve();
            } else if (data.action === google.picker.Action.CANCEL) {
              if (onCancel) onCancel();
              resolve();
            }
          });

        const picker = builder.build();
        picker.setVisible(true);
      } catch (err) {
        console.error('Picker initialization exception:', err);
        reject(err);
      }
    });
  });
}

/**
 * Direct Google Drive API File Search & Listing
 * Complementary API query to browse files when running in restricted iframe contexts.
 */
export async function listGoogleDriveFiles(accessToken: string): Promise<PickedFile[]> {
  const query = encodeURIComponent("trashed = false and (mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/json' or mimeType = 'text/csv' or mimeType = 'text/plain')");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,size,modifiedTime,iconLink,description)&pageSize=25&orderBy=modifiedTime desc`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to fetch Drive files (${res.status})`);
  }

  const data = await res.json();
  const files = data.files || [];
  return files.map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    url: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
    sizeBytes: f.size ? parseInt(f.size, 10) : undefined,
    lastEditedUtc: f.modifiedTime ? new Date(f.modifiedTime).getTime() : undefined,
    iconUrl: f.iconLink,
    description: f.description,
  }));
}
