var MailjetClient = require ('node-mailjet');

/*
the email is an object that must contain some properties:
FromEmail: sender email address
FromName: sender name
Subject: the email Subject
Html-part: the html content or Text-part if this is text only
Recipients: an Array of recipients

The callback is executed once the email is sent
*/
exports.sendEmail = function (cred, email, callback) {
  // we trigger the request with our data, and our callback function
  var mailjet = MailjetClient.connect(cred.key, cred.secret);

  var send = mailjet.post('send');
  send.request(email, callback);
  /*
  For this demo, there is no point to manage sessions... But you should...
  */
  mailjet.apiKey = null;
  mailjet.apiSecret = null;
}
