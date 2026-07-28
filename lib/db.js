import fs from 'fs';
import path from 'path';
import { adminDb } from './firebaseAdmin.js';

const LOCAL_DB_PATH = path.join(process.cwd(), 'server', 'db.json');

// --- Helper for Local JSON DB fallback ---
function readLocalDb() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local fallback db:', err);
  }
  return [];
}

function writeLocalDb(data) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    // Expected in Vercel serverless environment (read-only filesystem)
    return false;
  }
}

/**
 * Fetch all manuscript issues and articles from Firebase Firestore using Admin SDK.
 * Fallbacks to local db.json if Firebase Admin is not available.
 */
export async function readDb() {
  try {
    const issuesRef = adminDb.collection('issues');
    const querySnapshot = await issuesRef.get();

    if (querySnapshot.empty) {
      return [];
    }

    const issues = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (data.articles) {
        data.articles.forEach(article => {
          if (!article.category) {
            article.category = 'Finance & Accounting';
          }
        });
      }
      issues.push({ id: docSnapshot.id, ...data });
    });

    // Sort in memory
    issues.sort((a, b) => {
      const volA = parseInt(a.volume) || 0;
      const volB = parseInt(b.volume) || 0;
      if (volA !== volB) return volA - volB;
      const issA = parseInt(a.issue) || 0;
      const issB = parseInt(b.issue) || 0;
      return issA - issB;
    });

    writeLocalDb(issues);
    return issues;
  } catch (err) {
    console.error('Error reading from Firebase Firestore (Admin SDK):', err);
    return readLocalDb();
  }
}

/**
 * Helper to find all Firestore doc snapshots for a volume and issue,
 * regardless of string/number type or doc ID format.
 */
async function findMatchingIssueDocs(volume, issue) {
  const targetVol = parseInt(volume);
  const targetIss = parseInt(issue);

  try {
    const issuesRef = adminDb.collection('issues');
    const snapshot = await issuesRef.get();
    const matchedDocs = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const v = parseInt(data.volume);
      const i = parseInt(data.issue);
      if (v === targetVol && i === targetIss) {
        matchedDocs.push(docSnap);
      }
    });

    return matchedDocs;
  } catch (err) {
    console.error('Error finding matching issue docs:', err);
    return [];
  }
}

/**
 * Save/Update a single issue in Firebase Firestore using Admin SDK.
 */
export async function saveIssueToFirebase(issueData) {
  const currentDb = readLocalDb();
  const existingIdx = currentDb.findIndex(
    i => parseInt(i.volume) === parseInt(issueData.volume) && parseInt(i.issue) === parseInt(issueData.issue)
  );
  
  const issueObj = {
    volume: parseInt(issueData.volume),
    issue: parseInt(issueData.issue),
    year: parseInt(issueData.year),
    isPublished: Boolean(issueData.isPublished),
    publishDate: issueData.publishDate || 'Pending',
    articles: issueData.articles || []
  };

  if (existingIdx >= 0) {
    currentDb[existingIdx] = issueObj;
  } else {
    currentDb.push(issueObj);
  }
  writeLocalDb(currentDb);

  try {
    let docId = issueData.id || `vol-${issueData.volume}-iss-${issueData.issue}`;

    const matchedDocs = await findMatchingIssueDocs(issueData.volume, issueData.issue);
    if (matchedDocs.length > 0) {
      docId = matchedDocs[0].id;
    }

    const issueRef = adminDb.collection('issues').doc(docId);
    await issueRef.set(issueObj, { merge: true });
  } catch (err) {
    console.error('Error saving issue to Firestore (Admin SDK):', err);
    throw new Error(`Firestore save failed: ${err.message}`);
  }

  return issueObj;
}

/**
 * Update issue publish status in Firebase Firestore using Admin SDK.
 */
export async function updateIssuePublishStatus(volume, issue, isPublished) {
  const currentDb = readLocalDb();
  const target = currentDb.find(
    i => parseInt(i.volume) === parseInt(volume) && parseInt(i.issue) === parseInt(issue)
  );
  if (target) {
    target.isPublished = Boolean(isPublished);
    writeLocalDb(currentDb);
  }

  try {
    const matchedDocs = await findMatchingIssueDocs(volume, issue);
    if (matchedDocs.length > 0) {
      for (const docSnapshot of matchedDocs) {
        await adminDb.collection('issues').doc(docSnapshot.id).set({ isPublished: Boolean(isPublished) }, { merge: true });
      }
    } else {
      const defaultDocId = `vol-${volume}-iss-${issue}`;
      await adminDb.collection('issues').doc(defaultDocId).set({ isPublished: Boolean(isPublished) }, { merge: true });
    }
  } catch (err) {
    console.error('Error updating issue publish status (Admin SDK):', err);
    throw new Error(`Firestore status update failed: ${err.message}`);
  }
}

/**
 * Delete issue document from Firebase Firestore using Admin SDK.
 */
export async function deleteIssueFromFirebase(volume, issue) {
  const currentDb = readLocalDb();
  const updatedDb = currentDb.filter(
    i => !(parseInt(i.volume) === parseInt(volume) && parseInt(i.issue) === parseInt(issue))
  );
  writeLocalDb(updatedDb);

  try {
    const matchedDocs = await findMatchingIssueDocs(volume, issue);
    if (matchedDocs.length > 0) {
      for (const docSnapshot of matchedDocs) {
        await adminDb.collection('issues').doc(docSnapshot.id).delete();
      }
    }
  } catch (err) {
    console.error('Error deleting issue from Firestore (Admin SDK):', err);
    throw new Error(`Firestore delete failed: ${err.message}`);
  }
}
