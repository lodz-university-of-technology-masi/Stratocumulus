function addNewQuestion() {
    var newDiv = document.createElement("div");
    newDiv.className = "boxed";
    newDiv.padding = "1%";
    newDiv.innerHTML = "<table style=\"width:100%; height:100%;\">\n" +
        "                Co to jest 'klasa abstrakcyjna'?\n" +
        "                <button class=\"boxed-edit-button\" type=\"button\">Edytuj</button>\n" +
        "                <button class=\"boxed-delete-button\" type=\"button\">Usuń</button>\n" +
        "        </table>"

    var group = document.getElementById("group");
    group.appendChild(newDiv);
}