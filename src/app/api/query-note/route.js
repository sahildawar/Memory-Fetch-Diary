// app/api/query-note/route.js
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { getSummaryFromGroq } from "@/lib/embed";

export async function POST(request) {
  const { userId } = getAuth(request); // <- pass request
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }
  const { query } = await request.json();

  const allNotes = db.prepare(
    `SELECT * FROM notes WHERE userId = ? ORDER BY timestamp`
  ).all(userId);

  if (!allNotes.length) {
    return new Response(
      JSON.stringify({ result: "No notes yet." }),
      { status: 200 }
    );
  }

  const context = allNotes
    .map((n) => `${n.timestamp}: ${n.text}`)
    .join("\n");
  const prompt = `Given these notes:\n${context}\nAnswer this query: "${query}" like you're my second brain. with little bit exaggerating`;
  const summary = await getSummaryFromGroq(prompt);

  return new Response(
    JSON.stringify({ result: summary }),
    { status: 200 }
  );
}
