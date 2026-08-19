const axios = require('axios');

const cookie = `_ga_XTKXHMEFK4=GS2.1.s1765845899$o1$g0$t1765845903$j56$l0$h0; _ga_GV4TK4Q8DD=GS2.1.s1769476847$o13$g1$t1769476851$j56$l0$h0; _ga_CJTLDM9K8M=GS2.1.s1773283986$o4$g1$t1773284105$j59$l0$h0; _ga_DRF9QE37JW=GS2.1.s1773284117$o1$g1$t1773284175$j2$l0$h0; cookiesession1=678B2904E24D7248DB6DEE4DD1E4AF02; _ga_P98NSD99G5=GS2.1.s1782781387$o2$g0$t1782781389$j58$l0$h0; _ga_GEN1TKSK9F=GS2.1.s1786603345$o64$g1$t1786603402$j3$l0$h0; _ga_BFBJ8RKMM2=GS2.1.s1786710029$o288$g0$t1786710029$j60$l0$h0; _ga_3GX6KFTEWP=GS2.1.s1786710030$o286$g0$t1786710030$j60$l0$h0; _ga=GA1.1.577887830.1749602961; _ga_QXD29CHD2G=GS2.1.s1787109209$o277$g1$t1787109446$j60$l0$h0; XSRF-TOKEN=eyJpdiI6InlTWHJXWHcwbVhFSVdHY0pIWlFnRFE9PSIsInZhbHVlIjoiUlpycFVGZWZpdGJ5Sjl3b2k4NVVSazNQdFlmUVdJeUQ0VDJyL1pvaWpGelJBRDA3WStiWEU1djBiUGp2enVVU3RQMjBsa0pXb290eXQweWFPZTVwVzVibDZsdkFuSzlzQ2dGdUdlS2IyVldwczNXYVBVQ1IvdEhVdHJaVkZYZEgiLCJtYWMiOiIzMTE0ZmFiYzZjZjBkYTU5NjgzOWYwMmJhMjZiZGMwNTk5YThjZGRmMjJmYTI1ZmU1NTI1OTczMWI2YzJlOTQ1IiwidGFnIjoiIn0%3D; kemenag_session=eyJpdiI6IndKQWIwcXI4dGJYWjgzRjBtSmU1Zmc9PSIsInZhbHVlIjoiQmxPZWNaZjFoKzhiSS9vNU95Z3R3ZUoreUFaSzh2RmxTREdGSERhdTB5ZW1DcXkzV0V3L3VvUWYwZ25EL3RLV3p0WUNiNEdEM0FNWFJyU3JvSVZ2eWtVQ0hETXVvYkNXS1lxS1ZoWDZRZmNTR3Z5MjRqSms5Z0ttY2ozeXpXa0UiLCJtYWMiOiJjMDMyZTVjMzQ1ZGIzODk1YzE5ZWNhZGE2NTVmNDc2NzFhYzA0M2Q2NDJlYjFlMTM4MzE4MmYxZmExMDEzNTc4IiwidGFnIjoiIn0%3D`;

async function test() {
    try {
        const res = await axios.get('https://simpeg5.kemenag.go.id/get_data_pegawai?NIP_BARU=197512062025211025', {
            headers: {
                'Cookie': cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        console.log("STATUS:", res.status);
        console.log("DATA:", typeof res.data === 'string' ? res.data.substring(0, 100) : res.data);
    } catch(e) {
        console.error("ERROR:", e.message);
    }
}
test();
