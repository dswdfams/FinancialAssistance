const firebaseConfig = {
    apiKey: "AIzaSyDiOsr6bY5BDKdiBPRzDgSpurHdkkUlc3k",
    authDomain: "sia101-d60a1.firebaseapp.com",
    databaseURL: "https://sia101-d60a1-default-rtdb.firebaseio.com",
    projectId: "sia101-d60a1",
    storageBucket: "sia101-d60a1.appspot.com",
    messagingSenderId: "258109532727",
    appId: "1:258109532727:web:73d735dc749d2cb4ebedb2"
  };
  
const firebaseDatabase = firebase.initializeApp(firebaseConfig);
const database = firebaseDatabase.database();

const residentId = document.getElementById('residentId');

async function findResident(htmlPage) {
    const id = residentId.value;
    try {
        const residentRef = database.ref("Residents").child(id);
        residentRef.once('value', (snapshot) => {
            const resident = snapshot.val();
            if(resident == null) {
                alert("Resident not found");
            } else {
            resident.residentId = id;
            const queryString = new URLSearchParams(resident).toString();
            console.log(resident)
            window.location.href = htmlPage + "?" + queryString;
            }
        })
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}