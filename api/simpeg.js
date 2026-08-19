const axios = require('axios');

export default async function handler(req, res) {
    // Handle CORS (Vercel serverless function needs CORS headers if called from different domain, though usually same-origin)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url, cookie } = req.body;
    
    if (!url || !cookie) {
        return res.status(400).json({ error: 'URL and Cookie are required' });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Cookie': cookie,
                'Referer': 'https://simpeg5.kemenag.go.id/data_pegawai',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not=A?Brand";v="99", "Google Chrome";v="151", "Chromium";v="151"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            }
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Proxy Error for URL:', url, error.message);
        res.status(500).json({ 
            error: 'Gagal mengambil data dari SIMPEG',
            details: error.response ? error.response.data : error.message
        });
    }
}
