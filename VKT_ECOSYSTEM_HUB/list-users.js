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

async function testUsers() {
  try {
    console.log("Fetching users from Firestore...");
    const snap = await getDocs(collection(db, "users"));
    console.log(`Total users found: ${snap.size}`);
    snap.forEach((doc) => {
      const data = doc.data();
      console.log(`-----------------------------------------`);
      console.log(`UID: ${doc.id}`);
      console.log(`Email: ${data.email}`);
      console.log(`DisplayName: ${data.displayName}`);
      console.log(`CreatedAt: ${data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : JSON.stringify(data.createdAt)) : 'MISSING'}`);
      console.log(`AssignedPlan: ${data.assignedPlan}`);
    });
  } catch (err) {
    console.error("Error reading users:", err);
  }
}

testUsers();
