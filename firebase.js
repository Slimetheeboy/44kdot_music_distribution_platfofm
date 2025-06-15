const firebaseConfig = {
  apiKey: "AIzaSyD9ytYejDuuJg2oGJdKHyjhmK3sC98Djkg",
  authDomain: "kdot-distribution.firebaseapp.com",
  projectId: "kdot-distribution",
  storageBucket: "kdot-distribution.appspot.com",
  messagingSenderId: "664065044961",
  appId: "1:664065044961:web:0a718f62142774f48922a0"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();