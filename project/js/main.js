function initializeStreamListener() {
  const databaseStreamReference = firebase.database().ref('/stream/');

  databaseStreamReference.on('value', function(snapshot) {
    var messages = snapshot.val();
    $('#stream').empty();

    if (messages) {
      Object.keys(messages).forEach(function (key) {
        const message = messages[key];
        $('#stream').append(`<div>${message.body}</div>`);
      });
    }
  });
}

function addMessage(body, title) {
  var user = firebase.auth().currentUser;
  var authorPic = user.photoURL;
  var author = user.displayName;

  var postData = {
    author: author,
    authorPic: authorPic,
    title: title,
    body: body
  };

  var newPostKey = firebase.database().ref().child('stream').push().key;
  firebase.database().ref('/stream/' + newPostKey).set(postData);
}


function handleMessageFormSubmit() {
  var body = $('#new-post-body').val();
  var title = $('#new-post-title').val();

  addMessage(body, title);
}


function toggleSignIn() {
  if (!firebase.auth().currentUser) { 
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/plus.login");
    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("success");
    }).catch(function(error) {
      console.error("error", error);
    });
  } else { 
    firebase.auth().signOut();
  }

  $('#login-button').attr("disabled", true);
}


window.onload = function() {
  firebase.auth().onAuthStateChanged(function(user){
    if (user) {
      $('#stream').show();
      $('#login-button').html("Log out");
      initializeStreamListener();
    } else {
      $('#stream').hide();
      $('#login-button').html("Log in with google");
    }
    $('#login-button').attr("disabled", false);
  });
};




