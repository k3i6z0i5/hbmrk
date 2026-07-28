import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readDb, deleteIssueFromFirebase, saveIssueToFirebase } from '../../../../../lib/db';
import { authenticateToken } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const { volume, issue } = await params;
    const body = await request.json();
    const db = await readDb();

    const targetIssue = db.find(
      item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue)
    );

    if (!targetIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    if (body.year !== undefined) targetIssue.year = parseInt(body.year);
    if (body.publishDate !== undefined) targetIssue.publishDate = body.publishDate;
    if (body.isPublished !== undefined) targetIssue.isPublished = Boolean(body.isPublished);

    await saveIssueToFirebase(targetIssue);

    return NextResponse.json({ message: 'Issue updated successfully in Firebase DB', issue: targetIssue });
  } catch (err) {
    console.error('Update issue error:', err);
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const { volume, issue } = await params;

    // Try to clean up local PDF files (will silently skip on Vercel)
    try {
      const dbData = await readDb();
      const targetIssue = dbData.find(
        item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue)
      );
      if (targetIssue && targetIssue.articles) {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        targetIssue.articles.forEach(article => {
          if (article.pdfUrl && article.pdfUrl.startsWith('/uploads/')) {
            const filename = article.pdfUrl.replace('/uploads/', '');
            const filepath = path.join(uploadsDir, filename);
            try {
              if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            } catch (e) { /* ignore file cleanup errors */ }
          }
        });
      }
    } catch (readErr) {
      console.warn('Non-critical: Could not read DB for file cleanup:', readErr.message);
    }

    // Delete issue document from Firebase Firestore (this is the critical operation)
    await deleteIssueFromFirebase(volume, issue);

    return NextResponse.json({
      message: `Volume ${volume} Issue ${issue} deleted successfully from Firebase DB`
    });
  } catch (err) {
    console.error('Delete volume error:', err);
    return NextResponse.json({ error: `Deletion failed: ${err.message || 'Unknown server error'}` }, { status: 500 });
  }
}
