import express, { Request, Response } from 'express';
import cors from 'cors';
import bwipjs from 'bwip-js';
import PDFDocument from 'pdfkit';
import { customAlphabet } from 'nanoid';
import { CoinLabelData } from '../../shared/types';

const app = express();
app.use(cors());
app.use(express.json());


const generateNumericId = customAlphabet('0123456789', 9);

app.get('/api/generate-id', (req: Request, res: Response) => {
    const id = `JCG-${generateNumericId()}`;
    res.json({ id });
});

app.post('/api/print-label', async (req: Request, res: Response): Promise<void> => {
    try {
        const data: CoinLabelData = req.body;


        const doc = new PDFDocument({
            size: [144, 72],
            margin: 0
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=label-${data.id}.pdf`);
        doc.pipe(res);

        const barcodeBuffer = await bwipjs.toBuffer({
            bcid: 'code128',
            text: data.id,
            scale: 2,
            height: 10,
            includetext: false,
            paddingwidth: 0,
            paddingheight: 0
        });


        doc.fontSize(8).font('Helvetica-Bold');
        const title = `${data.year} ${data.denomination}`;
        doc.text(title, 0, 8, { width: 144, align: 'center' });

        doc.image(barcodeBuffer, 22, 22, { width: 100 });

        doc.fontSize(6).font('Helvetica');
        doc.text(data.id, 0, 50, { width: 144, align: 'center' });

        doc.fontSize(5).font('Helvetica-Bold');
        doc.text('RAW', 0, 58, { width: 144, align: 'center' });

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