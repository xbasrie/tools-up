const https = require('https');

// Custom HTTPS agent: ignore self-signed/invalid certs from government servers
const httpsAgent = new (require('https').Agent)({
    rejectUnauthorized: false,
    keepAlive: false
});

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
        // Use node-fetch compatible approach via Node's built-in https for government servers
        // that may have self-signed certs or geo-restrictions
        const { default: nodeFetch } = await import('node-fetch').catch(() => ({ default: null }));
        
        let response;
        
        if (nodeFetch) {
            // node-fetch with custom agent (supports rejectUnauthorized: false)
            response = await nodeFetch(url, {
                method: 'GET',
                agent: url.startsWith('https') ? httpsAgent : undefined,
                headers: {
                    'Cookie': cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'Referer': 'https://simpeg5.kemenag.go.id/'
                },
                timeout: 15000
            });
        } else {
            // Fallback: native fetch (Node 18+) — no custom SSL agent support
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Cookie': cookie,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'Referer': 'https://simpeg5.kemenag.go.id/'
                },
                signal: AbortSignal.timeout(15000)
            });
        }

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            return res.status(response.status).json({
                error: `Upstream responded with HTTP ${response.status}`,
                details: text.substring(0, 500)
            });
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const data = await response.json();
            return res.status(200).json(data);
        } else {
            const text = await response.text();
            // Try parsing as JSON anyway
            try {
                return res.status(200).json(JSON.parse(text));
            } catch {
                return res.status(200).json({ raw: text });
            }
        }

    } catch (error) {
        const cause = error.cause || {};
        console.error('Proxy Error:', {
            url,
            message: error.message,
            code: error.code || cause.code,
            cause: cause.message
        });
        return res.status(500).json({
            error: 'Gagal mengambil data dari SIMPEG',
            details: error.message,
            code: error.code || cause.code || 'UNKNOWN',
            hint: error.message.includes('fetch failed') 
                ? 'Server SIMPEG mungkin memblokir IP Vercel (US). Coba gunakan VPN Indonesia atau deploy ke region Asia.'
                : error.message
        });
    }
}
