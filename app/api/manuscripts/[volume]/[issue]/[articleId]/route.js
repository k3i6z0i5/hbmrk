import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readDb, saveIssueToFirebase } from '../../../../../../lib/db';
import { authenticateToken } from '../../../../../../lib/auth';

export async function PATCH(request, { params }) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const { volume, issue, articleId } = await params;
    const body = await request.json();
    const db = await readDb();

    const targetIssue = db.find(
      item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue)
    );

    if (!targetIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const articleIndex = targetIssue.articles ? targetIssue.articles.findIndex(a => a.id === articleId) : -1;
    if (articleIndex === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Merge updated fields
    const existing = targetIssue.articles[articleIndex];
    targetIssue.articles[articleIndex] = {
      ...existing,
      title:    body.title    !== undefined ? body.title    : existing.title,
      category: body.category !== undefined ? body.category : existing.category,
      abstract: body.abstract !== undefined ? body.abstract : existing.abstract,
      keywords: body.keywords !== undefined ? body.keywords : existing.keywords,
      pages:    body.pages    !== undefined ? body.pages    : existing.pages,
      doi:      body.doi      !== undefined ? body.doi      : existing.doi,
      authors:  body.authors  !== undefined ? body.authors  : existing.authors,
    };

    await saveIssueToFirebase(targetIssue);

    return NextResponse.json({ message: 'Article updated successfully in Firebase DB', article: targetIssue.articles[articleIndex] });
  } catch (err) {
    console.error('Edit article error:', err);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const { volume, issue, articleId } = await params;
    const db = await readDb();

    const targetIssue = db.find(
      item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue)
    );

    if (!targetIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const articleIndex = targetIssue.articles ? targetIssue.articles.findIndex(a => a.id === articleId) : -1;
    if (articleIndex === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const article = targetIssue.articles[articleIndex];
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Try to delete physical PDF file
    if (article.pdfUrl && article.pdfUrl.startsWith('/uploads/')) {
      const filename = article.pdfUrl.replace('/uploads/', '');
      const filepath = path.join(uploadsDir, filename);
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
        } catch (err) {
          console.error('Error deleting PDF file:', err);
        }
      }
    }

    // Remove article from db list
    targetIssue.articles.splice(articleIndex, 1);
    await saveIssueToFirebase(targetIssue);

    return NextResponse.json({ message: 'Article deleted successfully from Firebase DB' });
  } catch (err) {
    console.error('Delete article error:', err);
    return NextResponse.json({ error: 'Failed to process deletion' }, { status: 500 });
  }
}
