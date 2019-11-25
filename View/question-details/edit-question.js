// function addNewClosedQuestion() {
//     if (typeof addNewClosedQuestion.counter == 'undefined') {
//         addNewClosedQuestion.counter = 0;
//     }
//
//     addNewClosedQuestion.counter++;
//
//     var newDiv = document.createElement("div");
//     newDiv.className = "questionDiv";
//     var id = addNewClosedQuestion.counter.toString();
//     newDiv.setAttribute("id", "q" + id);
//     newDiv.innerHTML = "<label class=\"questionLabel\">Co to jest klasa abstrakcyjna?" + id + "</label>\n" +
//         "                <button id=\"e" + id + "\" type=\"button\" class=\"editQuestionButton\">Edytuj</button>\n" +
//         "                <button id=\"d" + id + "\" type=\"button\" class=\"deleteQuestionButton\" onclick='deleteQuestion(this)'>Usuń</button>";
//     var questionHr = document.getElementById("questionsHr");
//     questionHr.appendChild(newDiv);
// }
//
// function deleteQuestion(button) {
//     var id = button.getAttribute("id").replace("d", "q");
//     var questionLabel = document.getElementById(id);
//     questionLabel.remove();
// }
function addNewOpenQuestion() {
    if (typeof addNewOpenQuestion.counter == 'undefined') {
        addNewOpenQuestion.counter = 0;
    }

    addNewOpenQuestion.counter++;

    var newDiv = document.createElement("div");
    newDiv.className = "answerDiv";
    var id = addNewOpenQuestion.counter.toString();
    newDiv.setAttribute("id", "a" + id);
    newDiv.innerHTML = ""
}

function addNewClosedQuestion() {

}