import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB5AN9lSenHdYR2gxUGsVMMJZ2flQbFOxc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-5758307495-584da.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-5758307495-584da",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-5758307495-584da.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "162880584628",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:162880584628:web:cf2ba65d6e2367c8e2d0e1"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const storage = getStorage(app);
export const db = getFirestore(app);

const CMS_DOC_REF = doc(db, "cms", "main_content");
const VISITORS_COLLECTION_REF = collection(db, "symposium_visitors");

export type SymposiumVisitor = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  organization?: string;
  title?: string;
  createdAt: string;
};

/**
 * Uploads a photo or video file to Firebase Cloud Storage
 * @param file File object to upload
 * @param folder Target folder in Firebase storage (e.g. 'gallery', 'slideshows', 'news')
 * @param onProgress Optional progress callback (0 - 100%)
 * @returns Promise resolving to public download URL
 */
export async function uploadMediaToFirebaseStorage(
  file: File,
  folder: string = "uploads",
  onProgress?: (progress: number) => void
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const storageRef = ref(storage, fileName);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Firebase Storage Upload Error:", error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      }
    );
  });
}

/**
 * Saves entire CMS content state to Firebase Cloud Firestore.
 */
export async function saveContentToFirestore(data: any): Promise<void> {
  try {
    await setDoc(CMS_DOC_REF, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore save error:", err);
  }
}

/**
 * Subscribes to live real-time CMS content updates from Firebase Cloud Firestore.
 */
export function subscribeToFirestoreContent(onUpdate: (data: any) => void): () => void {
  try {
    const unsubscribe = onSnapshot(CMS_DOC_REF, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      }
    }, (err) => {
      console.warn("Firestore subscription error:", err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Firestore subscription init error:", err);
    return () => {};
  }
}

/**
 * Registers a visitor to the symposium_visitors collection in Firestore.
 */
export async function registerSymposiumVisitor(
  visitor: Omit<SymposiumVisitor, 'id' | 'createdAt'> & { createdAt?: string }
): Promise<string> {
  const visitorData = {
    ...visitor,
    createdAt: visitor.createdAt || new Date().toISOString()
  };

  // 1. Always save to LocalStorage offline cache
  const LOCAL_CACHE_KEY = 'asserwa_symposium_visitors_cache_v1';
  try {
    const existingRaw = localStorage.getItem(LOCAL_CACHE_KEY);
    const existing: SymposiumVisitor[] = existingRaw ? JSON.parse(existingRaw) : [];
    const localId = `visitor-${Date.now()}`;
    const newEntry: SymposiumVisitor = { id: localId, ...visitorData };
    existing.unshift(newEntry);
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn("Local storage cache error:", e);
  }

  // 2. Save to Firestore
  try {
    const docRef = await addDoc(VISITORS_COLLECTION_REF, visitorData);
    return docRef.id;
  } catch (err) {
    console.warn("Firestore visitor save warning (offline cache preserved):", err);
    return `local-${Date.now()}`;
  }
}

/**
 * Subscribes to real-time symposium visitor registrations.
 */
export function subscribeToSymposiumVisitors(
  onUpdate: (visitors: SymposiumVisitor[]) => void
): () => void {
  const LOCAL_CACHE_KEY = 'asserwa_symposium_visitors_cache_v1';
  
  // Deliver local cache first
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      onUpdate(JSON.parse(cached));
    }
  } catch (e) {}

  try {
    const q = query(VISITORS_COLLECTION_REF, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const visitors: SymposiumVisitor[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        visitors.push({
          id: doc.id,
          fullName: data.fullName || '',
          phone: data.phone || '',
          email: data.email || '',
          country: data.country || '',
          organization: data.organization || '',
          title: data.title || '',
          createdAt: data.createdAt || ''
        });
      });

      if (visitors.length > 0) {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(visitors));
        onUpdate(visitors);
      }
    }, (err) => {
      console.warn("Firestore visitors subscription error:", err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Firestore visitors init error:", err);
    return () => {};
  }
}

/**
 * Deletes a symposium visitor entry by ID.
 */
export async function deleteSymposiumVisitor(id: string): Promise<void> {
  const LOCAL_CACHE_KEY = 'asserwa_symposium_visitors_cache_v1';
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      const list: SymposiumVisitor[] = JSON.parse(cached);
      const filtered = list.filter(v => v.id !== id);
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(filtered));
    }
  } catch (e) {}

  try {
    const docRef = doc(db, "symposium_visitors", id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore delete warning:", err);
  }
}
