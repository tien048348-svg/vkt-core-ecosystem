import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore";

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

async function testQuery() {
  try {
    console.log("Querying with orderBy('createdAt', 'desc')...");
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    console.log(`Query returned ${snap.size} users:`);
    snap.forEach((doc) => {
      console.log(`- ${doc.id}: ${doc.data().email}`);
    });
  } catch (err) {
    console.error("Query failed:", err);
  }
}

testQuery();
