var express = require('express');
var router = express.Router();

/*
We import our `mailjet-util` file.
*/
var mailjet = require ('../mailjet-util');

// When the user make a GET request on http://my_web_site/, do that.
router.get('/', function (req, res) {
  /*
  req is the user request, it contains the data from the user
  as well as the url, and the user informations

  res is the response you want to send back to the user.
  It contains a bunch of methods, but we will simply tell it to render
  our `index` file. You can pass variables to it. Just pass it a title with
  whatever you want.
  */
  res.render('index', {
    title: 'Hello World',
  });
});

// When the user send a POST request on  http://my_web_site/send, do that.
router.post('/send/', function (req, res) {
  /*
  We can now call our senEmail method. Remember it takes an Email, and a callback
  The callback will process an error, if one, a response from the mailjet servers,
  and a body. If everything goes well, the body will confirm it.
  */
  mailjet.sendEmail(req.body, function (err, response, body) {
    // We send the response to the client !
    res.send(JSON.stringify({error: err, response: response, body: body}));
  });
});

module.exports = router;
