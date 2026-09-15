"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { ensureReviewsTable } from "@/lib/db";
import { inviteMatches } from "@/lib/invite";

export type Review = {
  id: string;
  name: string;
  company: string | null;
  body: string;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  name: string;
  company: string | null;
  body: string;
  created_at: Date | string;
};

export async function listReviews(): Promise<Review[]> {
  try {
    const sql = await ensureReviewsTable();
    const rows = (await sql`
      SELECT id, name, company, body, created_at
      FROM reviews
      ORDER BY created_at DESC
    `) as ReviewRow[];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      body: row.body,
      createdAt: new Date(row.created_at).toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function submitReview(
  code: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!inviteMatches(code)) {
    return { ok: false, error: "Tento odkaz na recenziu neplatí." };
  }

  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (name.length < 2) {
    return { ok: false, error: "Meno je príliš krátke." };
  }
  if (body.length < 12) {
    return { ok: false, error: "Recenzia je príliš krátka." };
  }
  if (name.length > 80 || company.length > 80 || body.length > 2000) {
    return { ok: false, error: "Text je príliš dlhý." };
  }

  const sql = await ensureReviewsTable();
  await sql`
    INSERT INTO reviews (id, name, company, body)
    VALUES (
      ${randomUUID()},
      ${name},
      ${company || null},
      ${body}
    )
  `;
  revalidatePath("/");
  return { ok: true };
}
