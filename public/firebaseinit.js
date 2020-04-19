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
//var storage = firebase.storage();

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// The start method will wait until the DOM is loaded.

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {

      let inputId = 'danny';
      alert("로그인 성공");
      location.href="/main.html?id="+inputId;
      return true;
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

ui.start('#firebaseui-auth-container', uiConfig);
