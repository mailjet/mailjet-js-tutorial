
## What you are going to create:
https://github.com/GuillaumeBadi/mailjet-js-tutorial

## Installation

There are a few things to install to get started.
  - A NodeJS installation.
  - the Node Package Manager (NPM).
  - The Mailjet Node Wrapper.
  - The Express Framework and Express Generator.
  - The Jade Templating Engine.

## NodeJS
Depending on your Operating System (OS), you may have to download an installer (for the windows people out there),
or simply issue a command in your terminal. It will install both Node and NPM on your environment.

### Ubuntu / Debian:
sudo apt-get install --yes nodejs

### OSX: (using brew)
brew install node

### Windows:
Download the .exe matching your system at https://nodejs.org/download/

## Mailjet
to go on with this tutorial, you will need a Mailjet account. Once you are signed in,
go find your API_key, and API_secret here.

save them into your shell:

```
echo 'export MJ_APIKEY_PUBLIC=YourApiKey' >> ~/.zshrc
echo 'export MJ_APIKEY_PRIVATE=YourApiSecret' >> ~/.zshrc
```

## Show me the code

First, you will have to install the express generator. To do so, simply run:

``` npm install express-generator -g ```

the `-g` tells npm that you want it installed globally on your machine.

run `express my_project` to let the generator create the basic architecture of our app.
`cd` into your project folder and let's see what we've got.

```
.
├── app.js (main node file)
├── bin
│   └── www
├── package.json (npm manifest)
├── public (this folder will be sent to the client)
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views (view folder with the jade template engine)
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

now run
``` npm install && npm install --save node-mailjet ```
the first `npm` command will read the `package.json` and install the dependencies.
The second one will add Mailjet to the dependencies.

You can now run the server by issuing a single command to the terminal:
``` npm start ```
There you go. Nothing amazing here but, let's go on.

## Write some mailjet code.

First, you will have to modify a single line in the `app.js` file. It will allow us to
read extended data from the client, like arrays etc..
Find this line:
``` app.use(bodyParser.urlencoded({ extended: false })); ```
and replace it with:
``` app.use(bodyParser.urlencoded({ extended: true }));```

into your application root folder, create and open a file with your favorite text-editor. call it `mailjet-util.js` for example.

You will have to import the mailjet module, by creating a reference to it.

``` javascript
var Mailjet = require ('node-mailjet')
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
```

To check if everything works, let's try to log your user informations to the console
by updating our file:

``` javascript
var Mailjet = require ('node-mailjet')
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

var me = Mailjet.get('user');

me.request(function(error, response, body) {
  console.log (response.statusCode, error || body);
});

// or

var req = me.request();

req
  .on('error', console.log)
  .on('success', function (response, body) {
    console.log (body);
  })
```

running this with `node mailjet-util.js` will print a JSON string that contains
your account informations. Great !

As you may have noticed, we stored a Mailjet resource in a variable, then
we requested it with the `request` method that takes a callback function.

You will now have to create a Mailjet module for your application. We will need
a single method: sendEmail.

let's add them into our file:
``` javascript

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
  // We add some parts to our content.
  email['Html-part'] += '\n\n' + '<p>Sent with the Mailjet API</p>';
  // we trigger the request with our data, and our callback function
  send.request(email, callback);
}
```

now open up your `routes/index.js` file. Basically, this is a controller.
Controllers are the brain of your application. The user will talk to them,
and they decide what to do.

``` javascript
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
  res.render({
    title: 'Hello World';
  });
});
```

now just add a few lines to handle emails that will be sent from the user

``` javascript

/*
We import our `mailjet-util` file.
*/
var mailjet = require ('../mailjet-util');

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Hello World',
  });
});

// When the user send a POST request on  http://my_web_site/send, do that.
router.post('/send', function (req, res) {
  /*
  The email data will be contained in the user request, in the body.
  */
  var emailToBeSent = req.body;

  /*
  We can now call our senEmail method. Remember it takes an Email, and a callback
  The callback will process an error, if one, a response from the mailjet servers,
  and a body. If everything goes well, the body will confirm it.
  */
  mailjet.sendEmail(emailToBeSent, function (error, response, body) {
    // If the statusCode is 201 or 200, it is a good thing
    console.log (response.statusCode, error || body);
    // We now go back to the homepage, by telling express to redirect to
    // http://my_web_site/

    // We send the response to the client !
    res.send(JSON.stringify({error: err, response: response, body: body}));
  });
});
```

Our backend is now working well. Let's make a simple design now to test the
application.

Open up your `views/index.jade` file. Basically, everything indented after
`block content` will be rendered inside the view. I made a very basic view for you.
Since I am not a designer, you can modify it, to make it look awesome !

``` jade
// views/index.jade

extends layout

block content
  img#logo(src="https://www.manycontacts.com/assets/img/synchronization/mailjet.png" width="100" height="100")
  #container
    #wrapper
      #sender.field
        input#sender-input(type="text" placeholder="Your Email")
      #name.field
        input#name-input(type="text" placeholder="Your Name")
      #subject.field
        input#subject-input(type="text" placeholder="Subject")
      #recipients.field
        input#recipients-input(type="text" placeholder="Recipients")
      #message
          #editor(contenteditable="true")
      #send-button
          button#send-input Send
  script(src="/javascripts/jquery.js")
  script(src="/javascripts/script.js")
```

``` css
/* public/stylesheet/style.css */
/* I am not a designer, remember */
* {
    margin: 0;
    padding: 0;
    list-style: none;
    box-sizing: border-box;
}

#logo {
    position: absolute;
    top: 10px;
    left: 10px;
}

input:focus , #editor:focus {
    outline: none;
    border: 1px solid #2c97de;
}

#subject input {
    color: #2c97de;
}

#container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

#wrapper {
    width: 960px;
    height: 500px;
}

.field {
    width: 100%;
}

#send-button button {
    float: right;
    padding: 10px 50px;
    outline: none;
    border: 1px solid silver;
    background-color: #fff;
    margin-top: 10px;
}

.field input {
    width: 100%;
    padding: 20px;
    margin-bottom: 5px;
}

#editor {
    border: 1px solid silver;
    font-family: Helvetica;
    width: 100%;
    height: 200px;
    outline: none;
    padding: 20px;
}
```

Now we need our client javascript to send our content to the server.
First, using jquery will make everything easier, so just Ctrl-S this to your
`public/javascripts/` folder -> http://code.jquery.com/jquery-1.9.0.js

Let's edit our main and only JS file now:

``` javascript

/*
This is a helper function that convert our recipients input into an array:
[{Email: ''}, {Email: ''}]
*/
function getRecipients () {
  var recipients = $('#recipients-input')
        .val()
        .match(/\S+/)
        .map(function (recipient) {
          return {Email: recipient};
        });
  return recipients;
}

window.onload = function () {
  /*
  Register a listener. When the Send button is clicked, execute the function.
  You want to test the data before sending it, but we are not going to make it today.
  */
  $('#send-button').click(function() {
    var subject = $('#subject-input').val(),
        recipients = getRecipients(),
        content = editor.innerHTML,
        name = $('#name-input').val(),
        sender = $('#sender-input').val();

    /*
    We will now make a POST request using jquery on the /send/ path
    */
    $.ajax({
      type: 'POST',
      url: '/send/',
      data: data,
      success: function (data) {
        // redirection to homepage
        window.location = '/';
      },
      error: function (err) {
        console.log (err);
      }
    });
  });
}
```
Run your server, and you are now able to send emails from your email address.
To be able to send emails from another address, you need to register a new sender
on the Mailjet dashboard, or via the API and confirm it via your inbox:

``` javascript
Mailjet.post('sender')
  .request({Email: 'your new email'})
  .on('error', console.log);
  .on('success', function (response, body) {
    console.log (body);
  })
```

Homework:
Try to add your contact list on the side. :)
