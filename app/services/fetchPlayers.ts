import { google } from "googleapis";
import { Player } from "@/app/types/player";

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } =
  process.env;

function requireEnv(name: string, val: string | undefined): string {
  if (!val || val.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

const sheetId = requireEnv("GOOGLE_SHEET_ID", GOOGLE_SHEET_ID);
const clientEmail = requireEnv("GOOGLE_CLIENT_EMAIL", GOOGLE_CLIENT_EMAIL);
const privateKey = requireEnv("GOOGLE_PRIVATE_KEY", GOOGLE_PRIVATE_KEY).replace(
  /\\n/g,
  "\n"
);

// Auth (use read‑only scope unless writing)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export async function fetchPlayers(): Promise<Player[]> {
  const sheets = google.sheets({ version: "v4", auth });
  // Include column I (Nationality)
  const range = "Players!A2:I500";
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  const rows = resp.data.values || [];

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
      nationality = "", // new column
    ] = r;

    // Sanitize jersey number: accept formats like "#07", "07", "7"
    let parsedNumber: number | undefined = undefined;
    if (rawNumber) {
      const cleaned = String(rawNumber).trim().replace(/^#/, "");
      const n = parseInt(cleaned, 10);
      if (!Number.isNaN(n)) parsedNumber = n;
    }

    return {
      id: String(i + 1),
      name: name.trim(),
      position: position.trim(),
      number: parsedNumber,
      height: height || undefined,
      weight: weight || undefined,
      image: imageUrl || undefined,
      imageAlt: imageAlt || undefined,
      bio: bio || undefined,
      nationality: nationality || undefined,
    };
  });
}
