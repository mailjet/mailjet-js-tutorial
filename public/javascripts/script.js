
/*
This is a helper function that convert our recipients input into an array:
[{Email: ''}, {Email: ''}]
*/
function getRecipients () {
  var array = document.getElementById('recipients-input')
    .value
    .replace(/\s+/, '')
    .split(',')
    .map(function (r) {
        return {Email: r};
    });
  return array;
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

    console.log (JSON.stringify(recipients, null, 4));

    var data = {
      'FromName': name,
      'FromEmail': sender,
      'Recipients': recipients,
      'Subject': subject,
      'Html-part': content,
    }

    /*
    We will now make a POST request using jquery on the /send/ path
    */
    $.ajax({
      type: 'POST',
      url: '/send/',
      data: data,
      success: function (data) {
        window.location = '/';
      },
      error: function (err) {
        console.log (err);
      }
    });
  });
}
