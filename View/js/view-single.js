function loadData(userJson) {
    originalJson = userJson;

    var name = userJson.name;
    var email = userJson.email;
    var uuid = userJson.id;

    $('#userFullName').val(name);
    $('#userEmail').val(email);
    $('#userId').val(uuid);

}