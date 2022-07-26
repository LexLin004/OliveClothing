// use Firebase (Auth and Firestore database)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

/** doc: retrieve documents inside of our fire store database. (get document instance)
 * getDoc: getting document's data
 * setDoc: setting document's data
 */
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection /** get a collection ref from db */,
  writeBatch,
  query,
  getDocs
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6w6wQV7sLg-K8ffI8P-C1vDParBBbR4Y",
  authDomain: "olive-clothing-db.firebaseapp.com",
  projectId: "olive-clothing-db",
  storageBucket: "olive-clothing-db.appspot.com",
  messagingSenderId: "416028116024",
  appId: "1:416028116024:web:3d435db41a95bc9ce212cd",
};

// Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  /** every time somebody interacts with our provider,
   * we want to always force them to select an account. */
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => {
  return signInWithPopup(auth, googleProvider);
};
export const signInWithGoogleRedirect = () => {
  return signInWithRedirect(auth, googleProvider);
};

export const db = getFirestore(); // initiate database

export const addCollectionAndDocuments = async ( // 用于将文件加入到firebase db
  collectionKey,
  objectsToAdd,
  field = 'title'
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object[field].toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};

export const getCategoriesAndDocuments = async() => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
}


export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users" /** collection */, userAuth.uid); // 无论是否document存在于db-collection，都会返回一个 object

  const userSnapshot = await getDoc(userDocRef); // 这个也会返回一个object, 但是可以使用 .exists() (return bool) 来判断doc是否存在

  /** 1. if user data exits, return back the userDocRef
   * 2. if not, create
   */
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation /** will overwrite if displayName is Null (for signupWithEmail) */,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback); //callback that you want to call every time this auth state changes

/** GoogleAuthProvide use new, while getAuth not
 * reanson:
 * Google Auth Provider is essentially a class that we get from
 * Firebase Authentication and this is connected to Google auth itself
 * Google auth has many different implementations.
 *
 * getAuth()
 * This is singleton, which means that the way your application
 * authenticates and the rules for authentication and
 * the authentication that communicates with Firebase,
 * they should always be the same one for every application.
 * It does not make sense that you have different authentication
 * services for one application. Once you authenticate for this
 * website as a whole, it should be held on to for the duration
 * of the lifecycle of this application.
 * You would not ever really need more than one authentication,
 * whereas you might need multiple providers because you might
 * have different buttons that trigger different forms of even
 * Google signinwithpop. Maybe some of them prompt you to select
 * an account, some of them don't.
 */
