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

async function getSheetsClient(): Promise<SheetsClient | null> {
  if (!sheetsClientPromise) {
    sheetsClientPromise = (async () => {
      const sheetId = getEnv("GOOGLE_SHEET_ID");
      const clientEmail = getEnv("GOOGLE_CLIENT_EMAIL");
      const privateKeyRaw = getEnv("GOOGLE_PRIVATE_KEY");

      if (!sheetId || !clientEmail || !privateKeyRaw) {
        console.warn(
          "[sheets] Missing Google Sheets env vars; skipping fetch."
        );
        return null;
      }

      const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
      const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });

      const sheets = google.sheets({ version: "v4", auth });
      return { sheets, sheetId } satisfies SheetsClient;
    })();
  }

  return sheetsClientPromise;
}

export async function fetchSheetRows(
  sheetName: string,
  range: string
): Promise<any[][]> {
  const client = await getSheetsClient();
  if (!client) return [];

  try {
    const resp = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.sheetId,
      range: `${sheetName}!${range}`,
    });
    return resp.data.values || [];
  } catch (err) {
    console.error(
      `[sheets] Failed to fetch range '${sheetName}!${range}':`,
      err
    );
    return [];
  }
}
