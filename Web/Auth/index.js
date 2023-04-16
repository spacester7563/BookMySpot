firebase.auth().onAuthStateChanged((user) => {
  console.log(user)
    if (!user) {
      location.replace("login.html")
    }
  });
  var authData = firebaseApp.auth();;

  if (authData) {
    console.log("Authenticated user with uid:", authData.uid);
  }

  function logout(){
    firebase.auth().signOut()
}