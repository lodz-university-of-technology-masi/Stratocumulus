function addNewQuestion() {

    if (typeof addNewQuestion.counter == 'undefined') {
        addNewQuestion.counter = 0;
    }

    addNewQuestion.counter++;

    var newDiv = document.createElement("div");
    newDiv.className = "boxed";
    newDiv.padding = "1%";
    var id = addNewQuestion.counter.toString();
    newDiv.setAttribute("id", "d" + id);
    newDiv.innerHTML = "<table style=\"width:100%; height:100%;\">\n" +
        "                Co to jest 'klasa abstrakcyjna'?\n" +
        "                <button class=\"boxed-edit-button\" type=\"button\">Edytuj</button>\n" +
        "                <button class=\"boxed-delete-button\" type=\"button\" id=b" + id + " onclick='deleteQuestion(this)'>Usuń</button>\n" +
        "        </table>";

    var group = document.getElementById("group");
    group.appendChild(newDiv);
}

function deleteQuestion(id) {
    var group = document.getElementById("group");
    var identifier = id.getAttribute("id");
    var divId = identifier.replace("b", "d");
    var div = document.getElementById(divId);
    group.removeChild(div);
}