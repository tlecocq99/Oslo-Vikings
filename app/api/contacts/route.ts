import { NextResponse } from "next/server";
import { fetchAllContacts } from "@/app/services/fetchContacts";

export const revalidate = 1800;

export async function GET() {
  try {
    const data = await fetchAllContacts();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("[contacts] Failed to load contacts", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load contacts" },
      { status: 500 }
    );
  }
}
