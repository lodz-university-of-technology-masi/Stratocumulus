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

function deletion(email) {
    callRecruiterAwsLambda("DELETE", `candidates?email=${email}`, afterDeleteCandidate, '', true);
}

function afterDeleteCandidate(response) {
    console.log(response);
    if (JSON.parse(response).result) {
        alert("Pomyślnie usunięto użytkownika");
        window.location.href = 'MainView.html';
    } else {
        alert("Błąd podczas usuwania użytkownika");
    }
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}