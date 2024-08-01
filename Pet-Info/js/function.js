
const name = document.getElementById('name');
const mail = document.getElementById('mail');
const alamat = document.getElementById('alamat');
const alasan = document.getElementById('alasan');
const ok = document.getElementById('ok');
const join = document.getElementById('join');

const database = firebase.database();
const db = firebase.firestore();
const usersRef = database.ref('/users');
join.addEventListener('click' , e => {
    e.preventDefault(); 
    usersRef.child(name.value).set({
        mail: mail.value, 
        alamat : alamat.value,
        alasan : alasan.value, 
    });
});