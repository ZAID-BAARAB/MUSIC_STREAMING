import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgRlyqr2ylTg4sB7U_fdzgW_JbJqdFj-0",
  authDomain: "music-291f0.firebaseapp.com",
  projectId: "music-291f0",
  storageBucket: "music-291f0.appspot.com",
  messagingSenderId: "46677990127",
  appId: "1:46677990127:web:d521ef265c1fd891ac991a",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");
const favouriteCollection = db.collection("favourites");
const likesCollection = db.collection("likes");
export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  favouriteCollection,
  likesCollection,
  storage,
};
