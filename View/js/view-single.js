var name;
var email;
var uuid;
function loadData(userJson) {
    originalJson = userJson;

    name = userJson.name;
    email = userJson.email;
    uuid = userJson.id;

    $('#userFullName').val(name);
    $('#userEmail').val(email);
    $('#userId').val(uuid);
    $('#setButton').val("Przypisz testy użytkownikowi " + name)

}

function setUserTests() {
    $.getScript("assign-tests.js", function () {
        loadTests(candId, candidateName);
    })
    $("#includedContent").load("assign-tests.html",function () {
        loadTests(uuid, name);
    });
}

$(function onDocReady() {
    $('#deleteForm').submit(handleDeletion);
});

function handleDeletion(event) {
    var desiredEmail = $('#userEmail').val();
    var desiredName = $('#userFullName').val();
    var desiredUUID = $('#userId').val();

    event.preventDefault();

    if (!isEmpty(desiredEmail) && !isEmpty(desiredName) && !isEmpty(desiredUUID)) {
        deletion(desiredEmail, desiredName);
    } else {
        alert('W pobranych danych znajduje się błąd!');
    }
}

function deletion(email, name) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            if(JSON.parse(this.responseText).result){
                alert("Pomyślnie usunięto użytkownika: " + name + " | " + email);
                window.location.href = 'MainView.html';
            }
            else {
                alert("Błąd podczas usuwania użytkownika: " + name + " | " + email);
            }

        }
    };

    xhttp.open("DELETE", "https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/candidates?email=" + email, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getRecruiterToken());

    xhttp.send();

}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function getRecruiterToken(){

    return sessionStorage.getItem('recruiterToken');

}

function getCandidateToken(){

    return sessionStorage.getItem('candidateToken');

}