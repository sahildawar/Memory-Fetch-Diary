export async function getSummaryFromGroq(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  console.log('Groq raw response:', res)

  const data = await res.json();
  return data.choices[0]?.message?.content || 'No summary available.';
}
