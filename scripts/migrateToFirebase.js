import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local and .env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hbmr-44b93';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

async function migrateData() {
  console.log('🚀 Starting HBMR Database Migration to Firebase Firestore using Service Account Admin...');

  if (!getApps().length) {
    if (clientEmail && privateKey) {
      console.log('🔑 Authenticating with Service Account credentials...');
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
    } else {
      console.log('⚡ Initializing Firebase Admin with Project ID...');
      initializeApp({ projectId });
    }
  }

  const db = getFirestore();

  const dbPath = path.join(process.cwd(), 'server', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Error: server/db.json file not found.');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dbPath, 'utf8');
  const issues = JSON.parse(rawData);

  console.log(`Found ${issues.length} issues in server/db.json to migrate:`);

  for (const issue of issues) {
    const docId = `vol-${issue.volume}-iss-${issue.issue}`;
    console.log(`Uploading Volume ${issue.volume} Issue ${issue.issue} (${docId})...`);

    const issueRef = db.collection('issues').doc(docId);
    await issueRef.set({
      volume: parseInt(issue.volume),
      issue: parseInt(issue.issue),
      year: parseInt(issue.year),
      isPublished: Boolean(issue.isPublished),
      publishDate: issue.publishDate || 'Pending',
      articles: issue.articles || []
    }, { merge: true });

    console.log(`✅ Successfully uploaded ${docId} with ${issue.articles?.length || 0} articles.`);
  }

  console.log('🎉 Migration completed successfully into Firebase Firestore!');
  process.exit(0);
}

migrateData().catch(err => {
  console.error('❌ Migration failed with error:', err);
  process.exit(1);
});
