saveToDatabase()
{

    var userName = document.getElementById("userName").value;
    var userSurname = document.getElementById("userSurname").value;
    var userEmail = document.getElementById("userEmail").value;
    var userEmail = document.getElementById("pass").value;
    var userEmail = document.getElementById("passRepeat").value;

    var userBirthDate = document.getElementById("userBirth").value = null;
    var userPhoneNum = document.getElementById("userPhoneNum").value = null;

    //todo add saving do database..

}

function addElement() {
    var userName = document.getElementById("userName").value;
    var y = document.getElementById("UserListId");

    if (y.style.display == "none") {

        var hyper = document.createElement("a");
        var li = document.createElement("li");
        var textnode = document.createTextNode(userName);

        hyper.setAttribute("href", 'dsa')
        hyper.appendChild(textnode);
        li.appendChild(hyper)
        document.getElementById("TestListId").appendChild(li);
    } else {
        var hyper = document.createElement("a");
        var li = document.createElement("li");
        var textnode = document.createTextNode(userName);

        hyper.setAttribute("href", 'dsa')
        hyper.appendChild(textnode);
        li.appendChild(hyper)
        document.getElementById("UserListId").appendChild(li);
    }

}