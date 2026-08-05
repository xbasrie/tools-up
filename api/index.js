const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { PDFDocument } = require('pdf-lib');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '..'))); // Serve static files from parent directory
app.use(express.json());

// Set up multer for file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// --- API: Merge PDF ---
app.post('/api/merge-pdf', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of req.files) {
            if (file.mimetype !== 'application/pdf') {
                return res.status(400).json({ error: `File ${file.originalname} bukan PDF.` });
            }
            
            const pdfToMerge = await PDFDocument.load(file.buffer);
            const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
            
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        const mergedPdfBytes = await mergedPdf.save();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="merged-result.pdf"');
        res.send(Buffer.from(mergedPdfBytes));
    } catch (error) {
        console.error('Error merging PDFs:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat menggabungkan PDF.' });
    }
});

// --- API: Compress PDF ---
app.post('/api/compress-pdf', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
        }

        // NOTE: True compression (e.g. downsampling images) requires external tools like Ghostscript.
        // Here we use pdf-lib to load and save, which strips unused objects and metadata.
        // It provides a "mock/light" compression. For a real robust compression to < 500kb, a third-party API or C++ lib is needed.
        
        // For multiple files, usually an API returns a ZIP. Since we return one response,
        // if user sends multiple, we can merge them into one compressed, or zip them.
        // But our UI compresses one by one conceptually. Let's handle a single file compression at a time.
        // We will process the FIRST file if multiple are sent, or loop and zip. 
        // Best approach for this simple API is to compress them one by one per request.
        
        const file = req.files[0];
        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: `File ${file.originalname} bukan PDF.` });
        }

        const pdfDoc = await PDFDocument.load(file.buffer);
        
        // We can just save it. pdf-lib by default removes some unused metadata.
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="compressed-${file.originalname}"`);
        res.send(Buffer.from(compressedPdfBytes));

    } catch (error) {
        console.error('Error compressing PDF:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengkompres PDF.' });
    }
});

// Start Server (Hanya berjalan lokal, Vercel akan menggunakan module.exports)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
        console.log(`Buka http://localhost:${port}/index.html di browser Anda.`);
    });
}

// Ekspor app untuk Vercel Serverless
module.exports = app;
