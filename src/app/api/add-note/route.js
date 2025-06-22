import { supabase } from '@/lib/supabase';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request) {
  const { userId } = getAuth(request); 
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  const { text } = await request.json();
  const timestamp = new Date().toISOString();

  const { error } = await supabase
    .from('notes')
    .insert([{ userId, text, timestamp }]);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
}