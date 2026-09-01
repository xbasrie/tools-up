export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing Google Drive file ID', { status: 400 });
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;
  
  try {
    const response = await fetch(driveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new Response(`Google Drive returned error: ${response.status}`, { status: response.status });
    }

    const headers = new Headers(response.headers);
    // Tambahkan header CORS agar bisa dibaca oleh frontend
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Expose-Headers', 'Content-Disposition');
    
    // Hapus encoding agar fetch client tidak kebingungan
    headers.delete('content-encoding'); 

    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (err) {
    return new Response(`Proxy Error: ${err.message}`, { status: 500 });
  }
}
