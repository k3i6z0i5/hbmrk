import fs from 'fs';
import path from 'path';
import { 
  db, 
  isFirebaseConfigured 
} from './firebase.js';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';

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
 * Fetch all manuscript issues and articles from Firebase Firestore.
 * Fallbacks to local db.json if Firebase is not yet configured.
 */
export async function readDb() {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not fully configured. Using local database store.');
    return readLocalDb();
  }

  try {
    const issuesRef = collection(db, 'issues');
    // Simple collection query without composite index requirement
    const querySnapshot = await getDocs(issuesRef);

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

    // Sort in memory to avoid requiring a composite index in Firebase
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
    console.error('Error reading from Firebase Firestore:', err);
    return readLocalDb();
  }
}

/**
 * Save/Update a single issue in Firebase Firestore.
 * Finds matching document in Firestore by volume & issue or document ID.
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

  if (isFirebaseConfigured()) {
    try {
      let docId = issueData.id || `vol-${issueData.volume}-iss-${issueData.issue}`;

      // Query Firestore for existing document for this volume & issue
      const issuesRef = collection(db, 'issues');
      const q = query(issuesRef, where('volume', '==', parseInt(issueData.volume)), where('issue', '==', parseInt(issueData.issue)));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        docId = querySnapshot.docs[0].id;
      }

      const issueRef = doc(db, 'issues', docId);
      await setDoc(issueRef, issueObj, { merge: true });
    } catch (err) {
      console.error('Error saving issue to Firestore:', err);
      throw new Error(`Firestore save failed: ${err.message}`);
    }
  }
  return issueObj;
}

/**
 * Update issue publish status in Firebase Firestore.
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

  if (isFirebaseConfigured()) {
    try {
      const issuesRef = collection(db, 'issues');
      const q = query(issuesRef, where('volume', '==', parseInt(volume)), where('issue', '==', parseInt(issue)));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        for (const docSnapshot of querySnapshot.docs) {
          await updateDoc(doc(db, 'issues', docSnapshot.id), { isPublished: Boolean(isPublished) });
        }
      } else {
        const defaultDocId = `vol-${volume}-iss-${issue}`;
        await updateDoc(doc(db, 'issues', defaultDocId), { isPublished: Boolean(isPublished) });
      }
    } catch (err) {
      console.error('Error updating issue publish status in Firestore:', err);
      throw new Error(`Firestore status update failed: ${err.message}`);
    }
  }
}

/**
 * Delete issue document from Firebase Firestore.
 */
export async function deleteIssueFromFirebase(volume, issue) {
  const currentDb = readLocalDb();
  const updatedDb = currentDb.filter(
    i => !(parseInt(i.volume) === parseInt(volume) && parseInt(i.issue) === parseInt(issue))
  );
  writeLocalDb(updatedDb);

  if (isFirebaseConfigured()) {
    try {
      const issuesRef = collection(db, 'issues');
      const q = query(issuesRef, where('volume', '==', parseInt(volume)), where('issue', '==', parseInt(issue)));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        for (const docSnapshot of querySnapshot.docs) {
          await deleteDoc(doc(db, 'issues', docSnapshot.id));
        }
      } else {
        const defaultDocId = `vol-${volume}-iss-${issue}`;
        await deleteDoc(doc(db, 'issues', defaultDocId));
      }
    } catch (err) {
      console.error('Error deleting issue from Firestore:', err);
      throw new Error(`Firestore delete failed: ${err.message}`);
    }
  }
}
