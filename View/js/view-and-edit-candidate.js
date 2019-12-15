

function showUserData() {

    var userName = document.getElementById("userName");
    var userSurname = document.getElementById("userSurname");
    var userEmail = document.getElementById("userEmail");
    var userBirthDate = document.getElementById("userBirth");
    var userPhoneNum = document.getElementById("userPhoneNum");

    //toDo: load data from database....

    userName.value = "Jan";
    userSurname.value = "Kowalski";
    userEmail.value = "jan.kowalski@gmail.com";
    userBirthDate.value = "2000-11-11";
    userPhoneNum.value = "123123123";
}

function saveUserData() {

    var userName = document.getElementById("userName").value;
    var userSurname = document.getElementById("userSurname").value;
    var userEmail = document.getElementById("userEmail").value;
    var userBirthDate = document.getElementById("userBirth").value;
    var userPhoneNum = document.getElementById("userPhoneNum").value;

    //toDo save updated data to database...


}