// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PDFDocument } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return
  }

  if (req.method === 'POST') {
    const mergedPdf = await PDFDocument.create();

    for (let document of req.body.documents) {
      document = await PDFDocument.load(document);

      const copiedPages = await mergedPdf.copyPages(document, document.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return res.status(200).json({ '$content-type': 'application/pdf', '$content': `${await mergedPdf.saveAsBase64() }`});
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '4mb'
    }
  },
};

