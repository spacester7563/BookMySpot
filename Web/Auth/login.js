document.getElementById("hello").addEventListener("submit",(event)=>{
event.preventDefault()
})
document.getElementById("hello2").addEventListener("submit",(event)=>{
  event.preventDefault()
  })


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      location.replace("index.html")
      window.location.href = `http://localhost:3000/?uid=${user.uid}`;
    }
  });

  function login(){
    const email = document.querySelector(".email").value
    const password = document.querySelector(".psw").value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error)=>{
        error.message
    })
}

  // Set up our register function
  
    function signUp(){
        const email = document.querySelector(".email2").value
        const password = document.querySelector(".psw2").value
        
        
        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
          
          
          
      
          
          //writeUserData(user,org)
        })
        .catch((error) => {
            console.log(error)
        });
    }
   
document.querySelector(".log2").addEventListener("click",()=>{
    var org={
    email:document.querySelector(".email2").value,
    firestname:document.querySelector(".fname").value,
    lastname:document.querySelector(".lname").value,
    organisation:document.querySelector(".organization").value,
    phonenumber:document.querySelector(".phoneNumber").value,
    password:document.querySelector(".psw2").value,
    confirmpassword:document.querySelector(".psw3").value,
  }
  console.log(org)
  writeUserData(org) 
})

function writeUserData(org) {
  console.log(org)
  firebase.database().ref("user/" + org.firestname).set(org);
}