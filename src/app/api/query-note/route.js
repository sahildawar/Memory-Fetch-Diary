import { supabase } from '@/lib/supabase';
import { getAuth } from "@clerk/nextjs/server";
import { getSummaryFromGroq } from "@/lib/embed";

export async function POST(request) {
  const { userId } = getAuth(request); 
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  const { query } = await request.json();

  const { data: allNotes, error } = await supabase
    .from('notes')
    .select('text, timestamp')
    .eq('userId', userId)
    .order('timestamp', { ascending: true });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }

  if (!allNotes || allNotes.length === 0) {
    return new Response(
      JSON.stringify({ result: "No notes yet." }),
      { status: 200 }
    );
  }

  const context = allNotes
    .map(n => `${n.timestamp}: ${n.text}`)
    .join('\n');

  const prompt = `Given these notes:\n${context}\nAnswer this query: "${query}" like you're my second brain. be little exaggerating`;
  const summary = await getSummaryFromGroq(prompt);

  return new Response(
    JSON.stringify({ result: summary }),
    { status: 200 }
  );
}