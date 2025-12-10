import express, { Request, Response } from 'express';
import cors from 'cors';
import bwipjs from 'bwip-js';
import PDFDocument from 'pdfkit';
import { customAlphabet } from 'nanoid';
import { CoinLabelData } from '../../shared/types';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Setup ID Generator (Numbers only for simplicity, length 9)
const generateNumericId = customAlphabet('0123456789', 9);

// ROUTE 1: Get a fresh ID for the frontend to display
app.get('/api/generate-id', (req: Request, res: Response) => {
    const id = `JCG-${generateNumericId()}`;
    res.json({ id });
});

// ROUTE 2: Generate the 2x1 inch PDF
app.post('/api/print-label', async (req: Request, res: Response): Promise<void> => {
    try {
        const data: CoinLabelData = req.body;

        // 1. Create PDF (Size: 2in x 1in)
        // PDFKit uses "points" where 72 points = 1 inch.
        // Width: 2 * 72 = 144 points
        // Height: 1 * 72 = 72 points
        const doc = new PDFDocument({
            size: [144, 72],
            margin: 0
        });

        // Pipe directly to HTTP Response (Browser will download/preview it)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=label-${data.id}.pdf`);
        doc.pipe(res);

        // 2. Generate Barcode Image Buffer (High Res)
        const barcodeBuffer = await bwipjs.toBuffer({
            bcid: 'code128',       // Barcode type
            text: data.id,         // Text to encode
            scale: 2,              // High resolution scaling
            height: 10,            // Bar height in mm
            includetext: false,    // We will draw text manually for better control
            paddingwidth: 0,
            paddingheight: 0
        });

        // 3. Layout: Draw Text & Image onto PDF

        // --- Top Text (Year + Denomination) ---
        // FontSize 8 is readable on thermal labels
        doc.fontSize(8).font('Helvetica-Bold');
        const title = `${data.year} ${data.denomination}`;
        doc.text(title, 0, 8, { width: 144, align: 'center' });

        // --- Middle: The Barcode Image ---
        // We center a 100px wide image. 
        // X = (144 - 100) / 2 = 22
        doc.image(barcodeBuffer, 22, 22, { width: 100 });

        // --- Bottom Text (ID + "RAW") ---
        doc.fontSize(6).font('Helvetica');
        doc.text(data.id, 0, 50, { width: 144, align: 'center' });

        doc.fontSize(5).font('Helvetica-Bold');
        doc.text('RAW', 0, 58, { width: 144, align: 'center' });

        // 4. Finalize
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating label');
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});