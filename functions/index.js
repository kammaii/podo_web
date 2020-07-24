const functions = require('firebase-functions');
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
// var serviceAccount = require("C://akoreanKeyStore_podo/podo-705c6-firebase-adminsdk-6ks88-c8eaabba97.json");

// function deploy 전에 실행할 것
// export GOOGLE_APPLICATION_CREDENTIALS="C://akoreanKeyStore_podo/podo-705c6-firebase-adminsdk-6ks88-c8eaabba97.json"
// functions랑 호스팅 에뮬레이터 실행
// firebase emulators:start --only functions,hosting

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  //databaseURL: "https://podo-705c6.firebaseio.com"
  databaseURL: "http://localhost:4000/firestore"
});

let messaging = admin.messaging();


function createDB() {
  console.log("DB 시작!");
  let db = admin.firestore();

  let podoDoc = db.collection('android').doc('podo');
  podoDoc.set({id: 'podo'});
  let requestsDoc = podoDoc.collection('teachers').doc('requests');
  requestsDoc.set({id: 'requests'});
  let writingDoc = requestsDoc.collection('writings').doc('0000-0000-0000');
  writingDoc.set({
    contents: '안녕하세요',
    correction: '교정',
    dateAnswer: '',
    dateRequest: '',
    guid: 'c8a9acb5-bfb1-4536-a31e-a30392c8dfcb',
    letters: '',
    status: 1,
    studentFeedback: '',
    teacherFeedback: '잘했어요',
    teacherId: 'danny',
    teacherName: 'Danny Park',
    userEmail: 'gabmanpark@gmail.com',
    userName: 'danny',
    userToken: 'eYLTFADIJSs:APA91bE2EqO4fdVUQGoz8ysTq9epL8SSMeKPmIiyjMRRrKGYVRg4AXInIx1wA_6sSIT33xst7gM7tvL4k_XS968WBjfeKLlIXZKZQxH3BpNNuC0TsmmMlG5lAAPzkX2UetxwKvneJnxQ',
    writingDate: '1592262099'
  });

  return 'success'
}


function sendMessage(token, payload) {
  return messaging.sendToDevice(token, payload)
    .then(function(response){
      console.log('Notification sent successfully:',response);
      return response;
    })
    .catch(function(error){
      console.log('Notification sent failed:',error);
    });
}


function onCommentReply(change, context) {
  let status = change.after.data().status;
  if(status === 2) {
    const payload = {
      data: {
      },
      notification: {
        title: 'Your feedback has been answered',
        body: 'check your message'
    }};
    sendMessage(change.after.data().userToken, payload);
  }

  return true;
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
  let studentEmail = change.after.data().userEmail;
  let status = change.after.data().status;
  let contents = change.after.data().contents;
  let correction = change.after.data().correction;
  let guid = change.after.data().guid;
  let teacherFeedback = change.after.data().teacherFeedback;
  let studentFeedback = change.after.data().studentFeedback;

  // 교정 완료하거나 재요청 하면 클라우드 메시지 보냄
  if(status === 2 || status === 99) {
    let title;
    let body;
    let statusString;

    if(status === 2) {
      title = "Your writing has been corrected";
      body = "check your writing";
      statusString = "2";
    } else {
      title = "Your writing has been returned";
      body = "Please write more clearly and send it again.\n* Your point has been returned to you.";
      statusString = "99";
    }

    const payload = {
      data: {
        status: statusString,
        guid: guid,
        contents: contents,
        correction: correction,
        teacherFeedback: teacherFeedback
      },
      notification: {
        tag: "writing",
        title: title,
        body: body
      }
    };
    sendMessage(change.after.data().userToken, payload);

  // 학생이 피드백 보내면 나한테 메일 보냄
  } else if(status === 3) {
    sendEmail(studentEmail, contents, correction, teacherFeedback, studentFeedback);
  }

  return true;
}


exports.createDB = functions.https.onRequest((request, response) => {
  let result = createDB()
  response.send(result);
});


exports.onCommentReply = functions
  .firestore.document('android/podo/reports/{reportsId}')
  .onWrite(onCommentReply);


exports.onWritingChange = functions
  .firestore.document('android/podo/teachers/requests/writings/{writingId}')
  .onWrite(onWritingChange);


let sendEmail = function(studentEmail, contents, correction, teacherFeedback, studentFeedback) {
  console.log("커렉션" + correction);
  console.log("학생피드백" + studentFeedback);
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
  "<p><b>학생이메일</b><br>"
  + studentEmail + "</p>"
  + "<p><b>내용</b><br>"
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
