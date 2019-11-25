function showTests() {
    var x = document.getElementById("UserListId");
    var y = document.getElementById("TestListId");

    x.style.display = "none";
    y.style.display = "block";
}

function showUsers() {
    var x = document.getElementById("TestListId");
    var y = document.getElementById("UserListId");

    x.style.display = "none";
    y.style.display = "block";
}


function showAddView() {
    var y = document.getElementById("UserListId");

    if (y.style.display == "none") {
        $("#includedContent").load("new-test.html");
    }
    else {
        $("#includedContent").load("add-candidate.html");
    }
}





