import { getAccessToken } from './workspaceAuth';

// Helper to get authorization header
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('গুগল অ্যাকাউন্ট সাইন-ইন করা নেই বা টোকেনের মেয়াদ শেষ হয়েছে। অনুগ্রহ করে আবার সাইন-ইন করুন।');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// ==========================================
// 1. GOOGLE DRIVE API
// ==========================================
export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
}

export async function listDriveFiles(query?: string): Promise<DriveFileItem[]> {
  const headers = await getAuthHeaders();
  let url = 'https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink,iconLink,modifiedTime,size)&pageSize=30&orderBy=modifiedTime desc';
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }
  
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `ড্রাইভ ফাইল লোড করতে ব্যর্থ (${res.status})`);
  }
  const data = await res.json();
  return data.files || [];
}

export async function createDriveFolder(name: string): Promise<DriveFileItem> {
  const headers = await getAuthHeaders();
  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'ফোল্ডার তৈরিতে ব্যর্থ');
  }
  return await res.json();
}

// ==========================================
// 2. GOOGLE DOCS API
// ==========================================
export interface GoogleDocResult {
  documentId: string;
  title: string;
  url: string;
}

export async function createGoogleDoc(title: string, content?: string): Promise<GoogleDocResult> {
  const headers = await getAuthHeaders();
  
  // Step 1: Create empty document
  const res = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers,
    body: JSON.stringify({ title }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'গুগল ডক তৈরিতে ব্যর্থ');
  }
  
  const doc = await res.json();
  const docId = doc.documentId;
  
  // Step 2: Insert text content if provided
  if (content && docId) {
    await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: content + '\n\n---\nউল্লাপাড়া প্রেসক্লাব ডিজিটাল আর্কাইভ\n',
            },
          },
        ],
      }),
    });
  }
  
  return {
    documentId: docId,
    title,
    url: `https://docs.google.com/document/d/${docId}/edit`,
  };
}

// ==========================================
// 3. GOOGLE SHEETS API
// ==========================================
export interface GoogleSheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export async function createGoogleSheet(title: string, headersList: string[], rowsData: string[][]): Promise<GoogleSheetResult> {
  const headers = await getAuthHeaders();
  
  // Create spreadsheet
  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: { title: 'তথ্য তালিকা' },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: headersList.map(h => ({ userEnteredValue: { stringValue: h } })),
                },
                ...rowsData.map(row => ({
                  values: row.map(cell => ({ userEnteredValue: { stringValue: cell } })),
                })),
              ],
            },
          ],
        },
      ],
    }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'গুগল শিট তৈরিতে ব্যর্থ');
  }
  
  const sheet = await res.json();
  return {
    spreadsheetId: sheet.spreadsheetId,
    spreadsheetUrl: sheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}/edit`,
    title,
  };
}

// ==========================================
// 4. GOOGLE SLIDES API
// ==========================================
export interface GoogleSlideResult {
  presentationId: string;
  url: string;
  title: string;
}

export async function createGooglePresentation(title: string, slidesContent?: { title: string; body: string }[]): Promise<GoogleSlideResult> {
  const headers = await getAuthHeaders();
  
  // Create presentation
  const res = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers,
    body: JSON.stringify({ title }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'গুগল স্লাইড তৈরিতে ব্যর্থ');
  }
  
  const presentation = await res.json();
  const presentationId = presentation.presentationId;
  
  // Add extra slide if specified
  if (slidesContent && slidesContent.length > 0) {
    const requests = slidesContent.map((slide, index) => ({
      createSlide: {
        insertionIndex: index + 1,
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_BODY',
        },
      },
    }));

    await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ requests }),
    }).catch(() => null);
  }
  
  return {
    presentationId,
    url: `https://docs.google.com/presentation/d/${presentationId}/edit`,
    title,
  };
}

// ==========================================
// 5. GOOGLE FORMS API
// ==========================================
export interface GoogleFormResult {
  formId: string;
  responderUri: string;
  editUrl: string;
  title: string;
}

export async function createGoogleForm(title: string, description: string): Promise<GoogleFormResult> {
  const headers = await getAuthHeaders();
  
  const res = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      info: {
        title,
        documentTitle: title,
        description,
      },
    }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'গুগল ফর্ম তৈরিতে ব্যর্থ');
  }
  
  const form = await res.json();
  return {
    formId: form.formId,
    responderUri: form.responderUri || `https://docs.google.com/forms/d/e/${form.formId}/viewform`,
    editUrl: `https://docs.google.com/forms/d/${form.formId}/edit`,
    title,
  };
}

// ==========================================
// 6. GMAIL API
// ==========================================
export interface GmailMessage {
  id: string;
  threadId: string;
  snippet?: string;
}

// Helper to encode UTF-8 string to base64url for RFC 2822
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function sendGmail(to: string, subject: string, bodyText: string): Promise<{ id: string }> {
  const headers = await getAuthHeaders();
  
  // Construct RFC 2822 Email with UTF-8 support
  const rawEmail = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText,
    '',
    '--',
    'উল্লাপাড়া প্রেসক্লাব, সিরাজগঞ্জ',
    'ডিজিটাল গণমাধ্যম ও প্রেস যোগাযোগ পোর্টাল',
  ].join('\r\n');
  
  const encodedRaw = toBase64Url(rawEmail);
  
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers,
    body: JSON.stringify({ raw: encodedRaw }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'জিমেইল পাঠাতে ব্যর্থ');
  }
  
  return await res.json();
}

export async function listRecentGmailMessages(maxResults: number = 10): Promise<GmailMessage[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`, {
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'জিমেইল বার্তা লোড করতে ব্যর্থ');
  }
  const data = await res.json();
  return data.messages || [];
}
