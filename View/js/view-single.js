function loadData(userJson) {
    originalJson = userJson;

    var name = userJson.name;
    var email = userJson.email;
    var uuid = userJson.id;

    $('#userFullName').val(name);
    $('#userEmail').val(email);
    $('#userId').val(uuid);
}

$(function onDocReady() {
    $('#deleteForm').submit(handleDeletion);
});

function handleDeletion(event) {
    var desiredEmail = $('#userEmail').val();
    var desiredName = $('#userFullName').val();
    var desiredUUID = $('#userId').val();

    var onSuccess = function deletionSuccess(result) {
        alert('Konto zostało poprawnie usunięte!');
        var confirmation = ('Removal successful.');
        if (confirmation) {
            window.location.href = 'MainView.html';
        }
    };
    var onFailure = function deletionFailure(err) {
        alert(err);
    };
    event.preventDefault();

    if (!isEmpty(desiredEmail) && !isEmpty(desiredName) && !isEmpty(desiredUUID)) {
        deletion(desiredEmail, desiredEmail, desiredUUID, onSuccess, onFailure);
    } else {
        alert('W pobranych danych znajduje się błąd!');
    }
}

function deletion(email, name, uuid, onSuccess, onFailure) {


}

function isEmpty(str) {
    return (!str || 0 === str.length);
}