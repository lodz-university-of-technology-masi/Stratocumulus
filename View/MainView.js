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

function addElement(name, link) {
    var y = document.getElementById("UserListId");

    if(y.style.display=="none") {

        var hyper = document.createElement("a");
        var li = document.createElement("li");
        var textnode = document.createTextNode("name");

        hyper.setAttribute("href", link)
        hyper.appendChild(textnode);
        li.appendChild(hyper)
        document.getElementById("TestListId").appendChild(li);
    }
    else {
        var hyper = document.createElement("a");
        var li = document.createElement("li");
        var textnode = document.createTextNode("name");

        hyper.setAttribute("href", link)
        hyper.appendChild(textnode);
        li.appendChild(hyper)
        document.getElementById("UserListId").appendChild(li);
    }

}

$(document).ready(function(){
    $("button").click(function(){
        $("#includedContent").load("new-test.html");
    });
});



