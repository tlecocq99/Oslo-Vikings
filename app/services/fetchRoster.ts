import { google } from "googleapis";
import { Player } from "@/app/types/player";

// Lazy env access to avoid throwing during build when secrets are absent (e.g. preview deploys)
function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v : undefined;
}

async function getSheetsClient(): Promise<{
  sheets: ReturnType<typeof google.sheets> | null;
  sheetId: string | null;
}> {
  const sheetId = getEnv("GOOGLE_SHEET_ID");
  const clientEmail = getEnv("GOOGLE_CLIENT_EMAIL");
  const privateKeyRaw = getEnv("GOOGLE_PRIVATE_KEY");
  if (!sheetId || !clientEmail || !privateKeyRaw) {
    return { sheets: null, sheetId: null };
  }
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  return { sheets, sheetId };
}

export async function fetchRoster(tab: string): Promise<Player[]> {
  const { sheets, sheetId } = await getSheetsClient();
  if (!sheets || !sheetId) {
    console.warn(
      `[fetchRoster] Missing Google Sheets env vars; returning empty roster for tab '${tab}'.`
    );
    return [];
  }
  const range = `${tab}!A2:H500`;
  let rows: any[][] = [];
  try {
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    rows = resp.data.values || [];
  } catch (err) {
    console.error(`[fetchRoster] Failed to fetch sheet '${tab}':`, err);
    return [];
  }
  return rows.map((r, i): Player => {
    const [
      name = "",
      position = "",
      rawNumber = "",
      height = "",
      weight = "",
      imageUrl = "",
      imageAlt = "",
      bio = "",
    ] = r;
    let parsedNumber: number | undefined = undefined;
    if (rawNumber) {
      const cleaned = String(rawNumber).trim().replace(/^#/, "");
      const n = parseInt(cleaned, 10);
      if (!Number.isNaN(n)) parsedNumber = n;
    }
    return {
      id: `${tab}-${i + 1}`,
      name: name.trim(),
      position: position.trim(),
      number: parsedNumber,
      height: height || undefined,
      weight: weight || undefined,
      image: imageUrl || undefined,
      imageAlt: imageAlt || undefined,
      bio: bio || undefined,
    };
  });
}
