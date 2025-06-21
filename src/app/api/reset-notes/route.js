// src/app/api/reset-notes/route.js

import { dbPromise, init } from '@/lib/db';

export async function POST() {
  try {
    const db = await dbPromise;
    await init(); // just to ensure table exists
    await db.run('DELETE FROM notes'); // this will clear the table
    return new Response(JSON.stringify({ success: true, message: 'Notes table reset successfully' }), {
      status: 200,
    });
  } catch (err) {
    console.error('Reset Error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}
