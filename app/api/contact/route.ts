import { NextResponse } from "next/server";

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "subject",
  "message",
] as const;

type ContactPayload = Record<(typeof REQUIRED_FIELDS)[number], string>;

type WebhookBody = ContactPayload & {
  receivedAt: string;
};

export async function POST(request: Request) {
  let payload: Partial<ContactPayload>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = payload?.[field];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missing.length > 0) {
    return NextResponse.json(
      {
        error: `Missing required field${
          missing.length > 1 ? "s" : ""
        }: ${missing.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const normalised = REQUIRED_FIELDS.reduce((acc, key) => {
    acc[key] = payload?.[key]?.trim() ?? "";
    return acc;
  }, {} as ContactPayload);

  const submission: WebhookBody = {
    ...normalised,
    receivedAt: new Date().toISOString(),
  };

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        console.error(
          `[contact] Webhook responded with ${response.status}: ${await response
            .text()
            .catch(() => "")}`
        );
      }
    } catch (error) {
      console.error(
        "[contact] Failed to forward submission to webhook:",
        error
      );
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[contact] Submission received:", submission);
  }

  return NextResponse.json(
    {
      message:
        "Thanks for reaching out! A member of the Oslo Vikings team will respond shortly.",
    },
    { status: 200 }
  );
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
