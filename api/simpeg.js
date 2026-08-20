module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let url, cookie;
    try {
        // In Vercel, req.body is already parsed if Content-Type is application/json
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        url = body.url;
        cookie = body.cookie;
    } catch(e) {
        return res.status(400).json({ error: 'Request body tidak valid atau bukan JSON' });
    }

    if (!url || !cookie) {
        return res.status(400).json({ error: 'Parameter url dan cookie wajib diisi' });
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cookie': cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Upstream responded with status ${response.status}`,
                details: await response.text()
            });
        }

        // Parse response as JSON; fallback to raw text if not JSON
        let data;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return res.status(200).json({ data });

    } catch (error) {
        console.error('Proxy Error for URL:', url, error.message);
        return res.status(500).json({
            error: 'Gagal mengambil data dari SIMPEG',
            details: error.message
        });
    }
}
