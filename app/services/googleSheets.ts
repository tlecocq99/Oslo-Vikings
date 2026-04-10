import { google } from "googleapis";

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : undefined;
}

type SheetsClient = {
  sheets: ReturnType<typeof google.sheets>;
  sheetId: string;
};

let sheetsClientPromise: Promise<SheetsClient | null> | null = null;

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

function parseServiceAccountJson(
  json: string
): ServiceAccountCredentials | null {
  try {
    const parsed = JSON.parse(json);
    const clientEmail = parsed?.client_email;
    const privateKeyRaw = parsed?.private_key;

    if (typeof clientEmail !== "string" || typeof privateKeyRaw !== "string") {
      console.warn(
        "[sheets] SERVICE_ACCOUNT_JSON is missing client_email or private_key."
      );
      return null;
    }

    return {
      client_email: clientEmail.trim(),
      private_key: privateKeyRaw.replace(/\\n/g, "\n"),
    } satisfies ServiceAccountCredentials;
  } catch (error) {
    console.error("[sheets] Failed to parse SERVICE_ACCOUNT_JSON:", error);
    return null;
  }
}

function resolveCredentials(): ServiceAccountCredentials | null {
  const clientEmail = getEnv("GOOGLE_CLIENT_EMAIL");
  const privateKeyRaw = getEnv("GOOGLE_PRIVATE_KEY");

  if (clientEmail && privateKeyRaw) {
    return {
      client_email: clientEmail.trim(),
      private_key: privateKeyRaw.replace(/\\n/g, "\n"),
    } satisfies ServiceAccountCredentials;
  }

  const serviceAccountJson = getEnv("SERVICE_ACCOUNT_JSON");
  if (serviceAccountJson) {
    const credentials = parseServiceAccountJson(serviceAccountJson);
    if (credentials) {
      return credentials;
    }
  }

  return null;
}

async function getSheetsClient(): Promise<SheetsClient | null> {
  if (!sheetsClientPromise) {
    sheetsClientPromise = (async () => {
      const sheetId = getEnv("GOOGLE_SHEET_ID") ?? getEnv("SHEET_ID");
      if (!sheetId) {
        console.warn(
          "[sheets] Missing Google Sheet ID env vars (`GOOGLE_SHEET_ID` or `SHEET_ID`); skipping fetch."
        );
        return null;
      }

      const credentials = resolveCredentials();
      if (!credentials) {
        console.warn(
          "[sheets] Missing Google Sheets credentials env vars; provide GOOGLE_CLIENT_EMAIL/GOOGLE_PRIVATE_KEY or SERVICE_ACCOUNT_JSON."
        );
        return null;
      }

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });

      const sheets = google.sheets({ version: "v4", auth });
      return { sheets, sheetId } satisfies SheetsClient;
    })();
  }

  return sheetsClientPromise;
}

function buildSheetRange(sheetName: string, range: string): string {
  const trimmedSheet = sheetName.trim();
  const trimmedRange = range.trim();

  if (!trimmedSheet) {
    return trimmedRange;
  }

  if (trimmedSheet.includes("!")) {
    return trimmedSheet;
  }

  const escapedSheet = trimmedSheet.replace(/'/g, "''");
  const sheetReference = `'${escapedSheet}'`;

  return trimmedRange ? `${sheetReference}!${trimmedRange}` : sheetReference;
}

const MAX_RETRIES = 4;
const RETRY_BASE_MS = 1_500; // 1.5 s → 3 s → 6 s → 12 s

function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === "object") {
    const code = (err as any).code ?? (err as any).status;
    if (code === 429 || code === 429) return true;
    const message = String((err as any).message ?? "");
    if (message.includes("Quota exceeded") || message.includes("429"))
      return true;
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSheetRows(
  sheetName: string,
  range: string
): Promise<any[][]> {
  const client = await getSheetsClient();
  if (!client) return [];

  const sheetRange = buildSheetRange(sheetName, range);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await client.sheets.spreadsheets.values.get({
        spreadsheetId: client.sheetId,
        range: sheetRange,
      });
      return resp.data.values || [];
    } catch (err) {
      if (isRateLimitError(err) && attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(
          `[sheets] Rate limited on '${sheetRange}'. Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})…`
        );
        await sleep(delay);
        continue;
      }
      console.error(`[sheets] Failed to fetch range '${sheetRange}':`, err);
      return [];
    }
  }

  return [];
}
