// app/api/add-note/route.js
import { getAuth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(request) {
  const { userId } = getAuth(request); // <- pass the request
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }
  const { text } = await request.json();
  const timestamp = new Date().toISOString();

  db.prepare(`INSERT INTO notes (userId, text, timestamp) VALUES (?, ?, ?)`)
    .run(userId, text, timestamp);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
