export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${id}/edit`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ title: `GDrive_Sheet_${id}` }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?) - Google Sheets<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : `Hasil_Download_Sheet_${id}`;

    return new Response(JSON.stringify({ title }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ title: `Hasil_Download_Sheet_${id}` }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
