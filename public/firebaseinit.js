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

function uiInit() {
  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  // The start method will wait until the DOM is loaded.
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {

        firebase.auth().onAuthStateChanged(function(user) {
          let inputId;

          switch (user.email.toString()) {
            case 'akorean.app@gmail.com' :
              inputId = 'danny';
              break;
          }

          location.href="/correction.html?id="+inputId;
        });

        return true;
      }
    },
    // signInSuccessUrl: 'main.html',
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };

  ui.start('#firebaseui-auth-container', uiConfig);
}


function getNewRequestCount() {
  let count = 0;
  let reference = db.collection("android/podo/teachers/requests/writings").where("status", "==", 1);
  reference.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      count++;
    })
    document.getElementById("btnCorrection").value = '교정조회' + '(' + count + ')';
    //$('#btnCorrection').html('교정조회' + '(' + count + ')')
  })
}



function createNavBtn(btnValue, btnId, clickFn) {
  var newInput = document.createElement("input");
  newInput.type = "button";
  newInput.value = btnValue;
  newInput.id = btnId;
  newInput.onclick = clickFn;
  return newInput;
}

function createNav() {
  var nav = document.getElementById('nav');
  var btn1 = createNavBtn("프로필설정", "", navProfile);
  var btn2 = createNavBtn("교정조회", "btnCorrection", navCorrection);
  var btn3 = createNavBtn("코멘트조회", "btnComment", navComment);
  var btn4 = createNavBtn("DB 검색", "", navDB);
  var btn5 = createNavBtn("메시지보내기", "", navMessage);

  nav.appendChild(btn1);
  nav.appendChild(btn2);
  nav.appendChild(btn3);
  nav.appendChild(btn4);
  nav.appendChild(btn5);
}

function navProfile() {
  return location.href="/profile.html?id=" + getExtra;
}
function navCorrection() {
  return location.href="/correction.html?id=" + getExtra;
}
function navComment() {
  return location.href="/comment.html?id=" + getExtra;
}
function navDB() {
  return location.href="/database_search.html?id=" + getExtra;
}
function navMessage() {
  return location.href="/message.html?id=" + getExtra;
}
