import { NextResponse } from 'next/server';
import { readDb, saveIssueToFirebase } from '../../../lib/db';
import { authenticateToken } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await readDb();
    return new NextResponse(JSON.stringify(db), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (err) {
    console.error('Error fetching manuscripts:', err);
    return NextResponse.json({ error: 'Failed to fetch database' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticateToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Access Denied: Invalid or Expired Token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { volume, issue, year, publishDate, isPublished } = body;

    if (!volume || !issue || !year) {
      return NextResponse.json({ error: 'Volume, Issue, and Year are required fields.' }, { status: 400 });
    }

    const db = await readDb();

    // Check if issue already exists
    const exists = db.some(item => parseInt(item.volume) === parseInt(volume) && parseInt(item.issue) === parseInt(issue));
    if (exists) {
      return NextResponse.json({ error: `Volume ${volume} Issue ${issue} already exists.` }, { status: 400 });
    }

    const newIssue = {
      volume: parseInt(volume),
      issue: parseInt(issue),
      year: parseInt(year),
      isPublished: Boolean(isPublished),
      publishDate: publishDate || 'Pending',
      articles: []
    };

    await saveIssueToFirebase(newIssue);

    return NextResponse.json({ message: 'Issue created successfully in Firebase DB', issue: newIssue }, { status: 201 });
  } catch (err) {
    console.error('Error creating issue:', err);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
