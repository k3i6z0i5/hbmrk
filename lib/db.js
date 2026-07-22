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
    console.error('Error writing local fallback db:', err);
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
    const q = query(issuesRef, orderBy('volume', 'asc'), orderBy('issue', 'asc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const issues = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      // Ensure category exists for all articles
      if (data.articles) {
        data.articles.forEach(article => {
          if (!article.category) {
            article.category = 'Finance & Accounting';
          }
        });
      }
      issues.push({ id: docSnapshot.id, ...data });
    });

    // Also update local fallback backup
    writeLocalDb(issues);

    return issues;
  } catch (err) {
    console.error('Error reading from Firebase Firestore:', err);
    console.log('Falling back to local db.json');
    return readLocalDb();
  }
}

/**
 * Write/Save entire database dataset to Firebase Firestore and local fallback.
 */
export async function writeDb(data) {
  // Always update local backup
  writeLocalDb(data);

  if (!isFirebaseConfigured()) {
    return true;
  }

  try {
    for (const issueItem of data) {
      const docId = `vol-${issueItem.volume}-iss-${issueItem.issue}`;
      const issueRef = doc(db, 'issues', docId);
      await setDoc(issueRef, {
        volume: parseInt(issueItem.volume),
        issue: parseInt(issueItem.issue),
        year: parseInt(issueItem.year),
        isPublished: Boolean(issueItem.isPublished),
        publishDate: issueItem.publishDate || 'Pending',
        articles: issueItem.articles || []
      }, { merge: true });
    }
    return true;
  } catch (err) {
    console.error('Error writing to Firebase Firestore:', err);
    return false;
  }
}

/**
 * Save a single issue to Firebase Firestore.
 */
export async function saveIssueToFirebase(issueData) {
  const docId = `vol-${issueData.volume}-iss-${issueData.issue}`;
  
  // Update local DB array
  const currentDb = readLocalDb();
  const existingIdx = currentDb.findIndex(i => i.volume === parseInt(issueData.volume) && i.issue === parseInt(issueData.issue));
  
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
      const issueRef = doc(db, 'issues', docId);
      await setDoc(issueRef, issueObj);
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
  const docId = `vol-${volume}-iss-${issue}`;

  // Update local
  const currentDb = readLocalDb();
  const target = currentDb.find(i => i.volume === parseInt(volume) && i.issue === parseInt(issue));
  if (target) {
    target.isPublished = isPublished;
    writeLocalDb(currentDb);
  }

  if (isFirebaseConfigured()) {
    try {
      const issueRef = doc(db, 'issues', docId);
      await updateDoc(issueRef, { isPublished });
    } catch (err) {
      console.error('Error updating issue publish status in Firestore:', err);
      throw new Error(`Firestore status update failed: ${err.message}`);
    }
  }
}

/**
 * Delete empty issue document from Firebase Firestore.
 */
export async function deleteIssueFromFirebase(volume, issue) {
  const docId = `vol-${volume}-iss-${issue}`;

  // Update local
  const currentDb = readLocalDb();
  const updatedDb = currentDb.filter(i => !(i.volume === parseInt(volume) && i.issue === parseInt(issue)));
  writeLocalDb(updatedDb);

  if (isFirebaseConfigured()) {
    try {
      const issueRef = doc(db, 'issues', docId);
      await deleteDoc(issueRef);
    } catch (err) {
      console.error('Error deleting issue from Firestore:', err);
      throw new Error(`Firestore delete failed: ${err.message}`);
    }
  }
}
