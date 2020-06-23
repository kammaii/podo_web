const functions = require('firebase-functions');
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
admin.initializeApp();


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
  console.log('!!!!! A Writing has Changed !!!!!');
  console.log(context.params.writingId);
  console.log(context.eventType);
  console.log('BEFORE:');
  console.log(change.before.data());
  console.log('AFTER:');
  console.log(change.after.data());
  //console.log(context);
  sendEmail();
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


/*
exports.correctionNotice = functions.firestore
  .document('android/podo') // android/podo/teachers/requests/writings/
  .onWrite((change, context) => {
    console.log(new Date());
    console.log(context.params.colId);
    console.log(context.params.teacherId);
    console.log(context.params.requestId);
    console.log(context.params.writingId);
    console.log(context.params.docId);
    console.log(change);
    sendMessage();
    let doc = change.after.data();
    console.log(doc);
    return Promise.resolve(true);
   });

exports.helloWorld = functions.https.onRequest((request, response) => {
 //sendEmail();
 response.send("Hello from Firebase!");
});
*/

let sendMessage = function() {
  console.log("Message sent");
}

let sendEmail = function() {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "akorean.app@gmail.com", // generated ethereal user
      pass: "gabman84" // generated ethereal password
    }
  });

  // send mail with defined transport object
  transporter.sendMail({
    from: "akorean.app@gmail.com", // sender address
    to: "gabmanpark@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });
}
