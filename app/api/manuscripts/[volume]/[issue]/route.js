import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readDb, deleteIssueFromFirebase } from '../../../../../lib/db';
import { authenticateToken } from '../../../../../lib/auth';

export async function DELETE(request, { params }) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const { volume, issue } = await params;
    const db = await readDb();

    const targetIssue = db.find(
      item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue)
    );

    if (!targetIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // Delete all PDFs associated with articles in this issue
    if (targetIssue.articles) {
      targetIssue.articles.forEach(article => {
        if (article.pdfUrl && article.pdfUrl.startsWith('/uploads/')) {
          const filename = article.pdfUrl.replace('/uploads/', '');
          const filepath = path.join(uploadsDir, filename);
          if (fs.existsSync(filepath)) {
            try {
              fs.unlinkSync(filepath);
            } catch (err) {
              console.error(`Error deleting PDF for article ${article.id}:`, err);
            }
          }
        }
      });
    }

    // Delete issue document from Firebase Firestore
    await deleteIssueFromFirebase(volume, issue);

    return NextResponse.json({
      message: `Volume ${volume} Issue ${issue} deleted successfully from Firebase DB`
    });
  } catch (err) {
    console.error('Delete volume error:', err);
    return NextResponse.json({ error: 'Failed to process deletion' }, { status: 500 });
  }
}
