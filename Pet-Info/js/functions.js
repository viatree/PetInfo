$(document).ready(function() {

  $("#registerForm").on("submit", function(e) {
       
    e.preventDefault();

      $('#registerModal').modal('hide');
      $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
      $('#messageModal').modal('show');

      var data = {
        email: $('#registerEmail').val(), //get the email from Form
      };
  
      var passwords = {
        password : $('#registerPassword').val(), //get the pass from Form
        cPassword : $('#registerConfirmPassword').val(), //get the confirmPass from Form
      };

      if( data.email != '' && passwords.password != ''  && passwords.cPassword != '' ){
        if( passwords.password == passwords.cPassword ){
          //create the user
          
          firebase.auth().createUserWithEmailAndPassword(data.email, passwords.password)
            .then(function() {
  
            //   //now user is needed to be logged in to save data
            //   auth = user;
  
            //   console.log(user);
  
            //   //now saving the profile data
            //   usersRef.child(user.uid).set(data).then(function(){
            //       console.log("User Information Saved:", user.uid);
            //   });
  
              $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
              
              $('#messageModal').modal('hide');

              
            })
            .catch(function(error){
              console.log("Error creating user:", error);
              $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
            });
        } 
        
        else {
          //password and confirm password didn't match
          $('#messageModalLabel').html(spanText("ERROR: Passwords didn't match", ['danger']))
        }
      }  
});

//Login
// $('#loginForm').on('click', function (e) {

//     e.preventDefault();

//     $('#loginModal').modal('hide');
//     $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
//     $('#messageModal').modal('show');

//     if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){

//     //login the user
//     var data = {
//         email: $('#loginEmail').val(),
//         password: $('#loginPassword').val()
//     };

//     firebase.auth().signInWithEmailAndPassword(data.email, data.password)
//         .then(function() {
//         // auth = authData;

//         // console.log(auth);

//         // $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
//         // $('#messageModal').modal('hide');

//         window.location.replace("index.html");
//         })
//         .catch(function(error) {
//         console.log("Login Failed!", error);
//         $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
//         });
//     }
// });

$("#loginBtn").on("click", function(e) {

  e.preventDefault();

  $('#loginModal').modal('hide');
  $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
  $('#messageModal').modal('show');

  if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){

        //login the user
        var data = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        };
    
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
            .then(function() {
    
            $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
            $('#messageModal').modal('hide');
    
              window.location.replace("Form.html");
            })
            .catch(function(error) {
              console.log("Login Failed!", error);
              $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
            });
  }
});

$("#logoutBtn").on("click", function() {

  firebase.auth().signOut().then(function() {
    
    alert("Sign Out Success !");

    window.location.replace("index.html");
  });

  
}); 

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    // jika sudah login, hilangkan container login
    document.getElementsByClassName("loginContainer")[0].classList.add("d-none");

    // dan tampilkan container logout dan booking
    document.getElementsByClassName("logoutContainer")[0].classList.remove("d-none");
    document.getElementsByClassName("bookingContainer")[0].classList.remove("d-none");
    document.getElementsByClassName("emailContainer")[0].classList.remove("d-none");

    $("#emailUser").text(user.email);

    $("#bookingBtn").click(function() {

      bookingData_tampil(user.email);
    });

    $("#bookingAdd").on("click", function() {

      var data = {
    
        name : $("#name").val(),
        email : $("#email").val(),
        address : $("#address").val(),
    
        // pet
        kind : $("#kind").val()    
      };
    
      var database = firebase.database();
      var dbRef = database.ref("contacts");
    
      if(data.name === "" || data.email === "" || data.address === "" || data.kind === "") {
    
        alert("Data tidak boleh kosong");
      }
    
      else {
    
        dbRef.child(user.uid).push().set(data).then(function() {

          // alert("Data tersimpan");
          $('#addContactModal').modal('hide');
        });
      }
    });

    tampilData(user.uid);
   
  } else {
    // No user is signed in.
    
  }
});

//  Menampilkan data dalam bentuk tabel
function tampilData(id) {

  // Buat referensi database firebase
  var database = firebase.database();
  var dbRef = database.ref("contacts").child(id);

  // Dapatkan referensi tabel
  var table = document.getElementById("tabel-contacts").getElementsByTagName("tbody")[0];

  // Membuang semua isi tabel
  $("#tabel-contacts").find("tr:gt(0)").remove();

  // Memuat data
  dbRef.on("child_added", function(data, prevChildKey) {

      var contactData = data.val();

      var row = table.insertRow(table.rows.length);

      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = contactData.name;
      cell2.innerHTML = contactData.email;
      cell3.innerHTML = contactData.address;
      cell4.innerHTML = contactData.kind;      
      // cell6.innerHTML = '<button class="btn btn-primary btn-sm" type="button" id="update_data" onclick="updateData_Tampil(' + newStatusAlat.id + ')" data-toggle="modal" data-target="#ModalUpdate">Update</button><button class="btn btn-danger btn-sm" type="button" id="delete_data" onclick="deleteData_Tampil(' + newStatusAlat.id + ')" data-toggle="modal" data-target="#ModalDel" style="margin-left:10px;">Hapus</button>';
  });
}

function bookingData_tampil(email) {

  $("#email").val(email);
}

function spanText(textStr, textClasses) {
    var classNames = textClasses.map(c => 'text-'+c).join(' ');
    return '<span class="'+classNames+'">'+ textStr + '</span>';
  }

   
});