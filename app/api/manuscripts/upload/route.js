import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readDb, saveIssueToFirebase } from '../../../../lib/db';
import { authenticateToken } from '../../../../lib/auth';

export async function POST(request) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const volume = formData.get('volume');
    const issue = formData.get('issue');
    const title = formData.get('title');
    const category = formData.get('category') || 'Finance & Accounting';
    const authors = formData.get('authors');
    const abstract = formData.get('abstract');
    const keywords = formData.get('keywords');
    const pages = formData.get('pages');
    const doi = formData.get('doi');
    const pdf = formData.get('pdf');

    if (!volume || !issue || !title || !authors || !abstract) {
      return NextResponse.json(
        { error: 'Missing required metadata fields (volume, issue, title, authors, abstract).' },
        { status: 400 }
      );
    }

    if (!pdf || typeof pdf === 'string') {
      return NextResponse.json({ error: 'PDF file is required.' }, { status: 400 });
    }

    if (pdf.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed!' }, { status: 400 });
    }

    const db = await readDb();
    const targetIssue = db.find(item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue));

    if (!targetIssue) {
      return NextResponse.json(
        { error: `Volume ${volume} Issue ${issue} does not exist. Create the issue first.` },
        { status: 404 }
      );
    }

    // Parse authors
    let parsedAuthors = [];
    try {
      parsedAuthors = JSON.parse(authors);
    } catch (err) {
      parsedAuthors = [{ name: authors, affiliation: 'HBS' }];
    }

    // Parse keywords
    let parsedKeywords = [];
    try {
      parsedKeywords = JSON.parse(keywords);
    } catch (err) {
      parsedKeywords = keywords ? keywords.split(',').map(k => k.trim()) : [];
    }

    // Ensure uploads directory exists inside public/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save PDF file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(pdf.name || 'document.pdf') || '.pdf';
    const filename = `article-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    const bytes = await pdf.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    const newArticle = {
      id: 'hbmr-' + Date.now().toString(36),
      title,
      category,
      authors: parsedAuthors,
      abstract,
      keywords: parsedKeywords,
      pages: pages || 'N/A',
      doi: doi || '',
      pdfUrl: `/uploads/${filename}`
    };

    if (!targetIssue.articles) targetIssue.articles = [];
    targetIssue.articles.push(newArticle);

    // Save back to Firebase Firestore
    await saveIssueToFirebase(targetIssue);

    return NextResponse.json(
      { message: 'Article uploaded and saved to Firebase DB successfully', article: newArticle },
      { status: 201 }
    );
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
