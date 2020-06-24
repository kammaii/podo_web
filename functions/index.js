const functions = require('firebase-functions');
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
admin.initializeApp();

let messaging = admin.messaging();


function createDB() {
  let db = admin.firestore();

  let podoDoc = db.collection('android').doc('podo');
  podoDoc.set({id: 'podo'});

  let requestsDoc = podoDoc.collection('teachers').doc('requests');
  requestsDoc.set({id: 'requests'});

  let writingDoc = requestsDoc.collection('writings').doc('writing');
  writingDoc.set({id: 'writing'});

  return 'success'
}


function onWritingChange(change, context) {
  //let data = change.after.data();
  //let status = data.status;
  console.log('!!!!! A Writing has Changed !!!!!');
  console.log(context.params.writingId);
  console.log(context.eventType);
  console.log('BEFORE:');
  console.log(change.before.data());
  console.log('AFTER:');
  console.log(change.after.data());
  let status = change.after.data().status;
  let contents = change.after.data().contents;
  let correction = change.after.data().correction;
  let teacherFeedback = change.after.data().teacherFeedback;
  let studentFeedback = change.after.data().studentFeedback;
  if(status == 3) {
    sendEmail(contents, correction, teacherFeedback, studentFeedback);
  }
  return true;
}


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});


exports.createDB = functions.https.onRequest((request, response) => {
  let result = createDB()
  response.send(result);
});


exports.onWritingChange = functions
  .firestore.document('android/podo/teachers/requests/writings/{writingId}')
  .onWrite(onWritingChange);


let sendMessage = function() {
  console.log("Message sent");
}

let sendEmail = function(status, contents, correction, teacherFeedback, studentFeedback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "akorean.app@gmail.com", // generated ethereal user
      pass: "gabman84" // generated ethereal password
    }
  });

  // send mail with defined transport object
  let mailSubject = "학생이 피드백을 보냈습니다.";
  let mailContents =
  "<p><b>내용</b><br>"
  + contents + "</p>"
  + "<p><b>교정</b><br>"
  + correction + "</p>"
  + "<p><b>선생님 피드백</b><br>"
  + teacherFeedback + "</p>"
  + "<p><b>학생 피드백</b><br>"
  + studentFeedback + "</p>";

  transporter.sendMail({
    from: "akorean.app@gmail.com", // sender address
    to: "akorean.app@gmail.com", // list of receivers
    subject: mailSubject, // Subject line
    //text: "Hello world?", // plain text body
    html: mailContents // html body
  });
}
