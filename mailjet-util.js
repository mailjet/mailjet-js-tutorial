var Mailjet = require ('node-mailjet')
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

/*
we register a resource to perform multiple tasks
To learn more about the resources you can use, there is a well maintained
API reference: dev.mailjet.com
 */
var send = Mailjet.post('send');
var me = Mailjet.get('user');

me.request(function(error, response, body) {
  console.log (response.statusCode, error || body);
});

/*
the email is an object that must contain some properties:
FromEmail: sender email address
FromName: sender name
Subject: the email Subject
Html-part: the html content or Text-part if this is text only
Recipients: an Array of recipients

The callback is executed once the email is sent
*/
exports.sendEmail = function (email, callback) {
  // we trigger the request with our data, and our callback function
  send.request(email, callback);
}
