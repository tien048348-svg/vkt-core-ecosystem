import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4YT1SsITly6bfPBnUui19v6qJ4qv-SC8",
  authDomain: "vkt-ecosystem-hub.firebaseapp.com",
  projectId: "vkt-ecosystem-hub",
  storageBucket: "vkt-ecosystem-hub.firebasestorage.app",
  messagingSenderId: "581932748990",
  appId: "1:581932748990:web:34a2d256147c29d8800eef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listApps() {
  const querySnapshot = await getDocs(collection(db, "apps"));
  querySnapshot.forEach((doc) => {
    console.log(`=========================================`);
    console.log(`ID: ${doc.id}`);
    console.log(`Name: ${doc.data().name}`);
    console.log(`Description: ${doc.data().description}`);
    console.log(`aiKnowledge: ${doc.data().aiKnowledge}`);
  });
}

listApps();
