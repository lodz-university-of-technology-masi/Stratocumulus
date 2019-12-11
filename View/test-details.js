function addNewClosedQuestion() {
    if (typeof addNewClosedQuestion.counter == 'undefined') {
        addNewClosedQuestion.counter = 0;
    }

    addNewClosedQuestion.counter++;
    var newDiv = document.createElement("div");
    newDiv.className = "question_div";
    var id = "q" + addNewClosedQuestion.counter.toString();
    var answer1Id = id + "a1";
    var answer2Id = id + "a2";
    var answer3Id = id + "a3";
    var answer4Id = id + "a4";
    var deleteButtonId = "d" + addNewClosedQuestion.counter.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "       <nobr> <label class=\"question_label\">\n" +
        "            Treść pytania zamkniętego:\n" +
        "        </label>\n" +
        "        <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button> </nobr>\n" +
        "            <input type=\"text\">\n" +
        "<label class=\"question_label\">Warianty odpowiedzi:</label>" +
        "        <input id=\"" + answer1Id + "\" type=\"text\">" +
        "        <input id=\"" + answer2Id + "\" type=\"text\">" +
        "        <input id=\"" + answer3Id + "\" type=\"text\">" +
        "        <input id=\"" + answer4Id + "\" type=\"text\">";

    var questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function addNewOpenQuestion() {
    if (typeof addNewOpenQuestion.counter == 'undefined') {
        addNewOpenQuestion.counter = 0;
    }

    addNewOpenQuestion.counter++;
    var newDiv = document.createElement("div");
    newDiv.className = "question_div";
    var id = "q" + addNewOpenQuestion.counter.toString();
    var deleteButtonId = "d" + addNewOpenQuestion.counter.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "        <nobr>\n" +
        "            <label class=\"question_label\">\n" +
        "                Treść pytania otwartego:\n" +
        "            </label>\n" +
        "            <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button>\n" +
        "        </nobr>\n" +
        "        <input type=\"text\">";

    var questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function deleteQuestion(button) {
    var id = button.getAttribute("id").replace("d", "q");
    var questionLabel = document.getElementById(id);
    questionLabel.remove();
}