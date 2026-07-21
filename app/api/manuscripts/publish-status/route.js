import { NextResponse } from 'next/server';
import { readDb, updateIssuePublishStatus } from '../../../../lib/db';
import { authenticateToken } from '../../../../lib/auth';

export async function PATCH(request) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { volume, issue, isPublished } = body;

    const db = await readDb();
    const targetIssue = db.find(item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue));

    if (!targetIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    await updateIssuePublishStatus(volume, issue, Boolean(isPublished));

    targetIssue.isPublished = Boolean(isPublished);
    return NextResponse.json({ message: 'Publication status updated in Firebase DB', issue: targetIssue });
  } catch (err) {
    console.error('Error updating status:', err);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
