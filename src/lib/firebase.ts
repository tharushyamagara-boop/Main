import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-5758307495-584da.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-5758307495-584da",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-5758307495-584da.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const storage = getStorage(app);
export const db = getFirestore(app);

const CMS_DOC_REF = doc(db, "cms", "main_content");

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
