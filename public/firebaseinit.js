var firebaseConfig = {
  apiKey: "AIzaSyBC3FF6Wj6VkxbojIlxx_0mvF1U9A19YZU",
  authDomain: "podo-705c6.firebaseapp.com",
  databaseURL: "https://podo-705c6.firebaseio.com",
  projectId: "podo-705c6",
  storageBucket: "podo-705c6.appspot.com",
  messagingSenderId: "19763591697",
  appId: "1:19763591697:web:0f8a093de3e3faca6d4fb0",
  measurementId: "G-E77Q7L26MG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();
