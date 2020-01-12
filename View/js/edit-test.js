var originalJson;

var questionsCount = 0;

function loadTest(testJson) {
    originalJson = testJson;

    var name = testJson.name;
    var language = testJson.language;
    var questions = testJson.questions;

    $('#testNameInput').val(name);
    $('.select-language').val(language);

    displayInputs(questions);
    displayQuestions(questions);
}

function displayInputs(questions) {
    questions.forEach(function (question) {
        if (question.type === 'c') {
            addNewClosedQuestion();
        } else if (question.type === 'o') {
            addNewOpenQuestion();
        } else if (question.type === 'n') {
            addNewNumericQuestion();
        }
    });
}

function displayQuestions(questions) {
    $('[id^=content]').each(function (index) {
        var question = questions[index];
        this.value = question.content;

        if (this.className === 'closed') {
            for (var i = 0; i < 4; i++) {
                var answerContent = question.answers[i];
                var answerId = 'q' + (index + 1) + 'a' + (i + 1).toString();
                $('#' + answerId).val(answerContent);
            }
        }
    });
}

function addNewClosedQuestion() {
    questionsCount++;

    addNewClosedQuestion.counter++;
    var newDiv = document.createElement("div");
    newDiv.className = "question_div";
    var id = "q" + questionsCount.toString();
    var answer1Id = id + "a1";
    var answer2Id = id + "a2";
    var answer3Id = id + "a3";
    var answer4Id = id + "a4";
    var deleteButtonId = "d" + questionsCount.toString();
    var contentId = 'content' + questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "       <nobr> <label class=\"question_label\">\n" +
        "            Treść pytania zamkniętego:\n" +
        "        </label>\n" +
        "        <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button> </nobr>\n" +
        "            <input class='closed' id='" + contentId + "' type=\"text\">\n" +
        "<label class=\"question_label\">Warianty odpowiedzi:</label>" +
        "        <input id=\"" + answer1Id + "\" type=\"text\">" +
        "        <input id=\"" + answer2Id + "\" type=\"text\">" +
        "        <input id=\"" + answer3Id + "\" type=\"text\">" +
        "        <input id=\"" + answer4Id + "\" type=\"text\">";

    var questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function addNewOpenQuestion() {
    questionsCount++;

    addNewOpenQuestion.counter++;
    var newDiv = document.createElement("div");
    newDiv.className = "question_div";
    var id = "q" + questionsCount.toString();
    var deleteButtonId = "d" + questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "        <nobr>\n" +
        "            <label class=\"question_label\">\n" +
        "                Treść pytania otwartego:\n" +
        "            </label>\n" +
        "            <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button>\n" +
        "        </nobr>\n" +
        "        <input class='open' id='content" + questionsCount.toString() + "' type=\"text\">";

    var questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function addNewNumericQuestion() {
    questionsCount++;

    addNewOpenQuestion.counter++;
    var newDiv = document.createElement("div");
    newDiv.className = "question_div";
    var id = "q" + questionsCount.toString();
    var deleteButtonId = "d" + questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "        <nobr>\n" +
        "            <label class=\"question_label\">\n" +
        "                Treść pytania liczbowego:\n" +
        "            </label>\n" +
        "            <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button>\n" +
        "        </nobr>\n" +
        "        <input class='numeric' id='content" + questionsCount.toString() + "' type=\"text\">";

    var questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function deleteQuestion(button) {
    var id = button.getAttribute("id").replace("d", "q");
    var questionLabel = document.getElementById(id);
    questionLabel.remove();
}

function getFilledTestJson() {
    var testName = $("#testNameInput").val();

    var modifiedJson = {
        "name": testName,
        "language": $(".select-language").val(),
        "questions": readQuestionsFromHtml(),
    };

    return modifiedJson;
}

function handleSaveTestButton(event) {
    var json = getFilledTestJson();

    console.log(json);

    clearIncludedView();

    sendEditRequest(json);
}

function handleDeleteTestButton(event) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            reloadList();
            showSuccessPopup("Pomyslnie usunieto test: " + originalJson.name);
        }
    };

    var testId = originalJson.id;
    xhttp.open("DELETE", "https://rj55i1bsub.execute-api.us-east-1.amazonaws.com/dev/tests?id=" + testId, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getRecruiterToken());

    clearIncludedView();

    xhttp.send();
}

function handleTranslateManuallyButton(event) {
    var json = getFilledTestJson();

    if (json.language === 'PL') {
        json.language = 'EN';
    } else {
        json.language = 'PL';
    }

    alert(JSON.stringify(json));
    clearIncludedView();
    showAddTestView(json);
}

function handleAutoTranslateButton(event) {
    var json = getFilledTestJson();

    var translateLang = json.language === 'PL' ? 'pl-en' : 'en-pl';

    autoTranslate(translateLang, json);
}

function autoTranslate(translateLang, testJson) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert(this.responseText);
            console.log(this.responseText);
            clearIncludedView();
            showAddTestView(JSON.parse(this.responseText));
        }
    };

    alert(JSON.stringify(testJson));
    console.log(JSON.stringify(testJson));

    xhttp.open("POST", "https://rj55i1bsub.execute-api.us-east-1.amazonaws.com/dev/translate-test?lang=" + translateLang, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getRecruiterToken());

    xhttp.send(JSON.stringify(testJson));
}

function readQuestionsFromHtml() {
    var questionsJson = [];

    $('[id^=content]').each(function (index) {
        var questionContent = this.value;
        var questionNo = this.id.replace("content", "");

        var questionJson = {
            "no": questionNo,
            "content": questionContent
        };

        if (this.className === 'closed') {
            questionsJson.push(readClosedQuestionFromHtml(questionJson, questionNo));

        } else {
            questionJson.type = this.className === 'open' ? 'o' : 'n';
            questionsJson.push(questionJson);
        }
    });

    return questionsJson;
}

function readClosedQuestionFromHtml(questionJson, questionNo) {
    questionJson.type = 'c';
    questionJson.numAnswers = 4;
    questionJson.answers = [];

    for (var i = 0; i < 4; i++) {
        var answerId = 'q' + questionNo + 'a' + (i + 1).toString();
        var answerContent = $('#' + answerId).val();
        questionJson.answers.push(answerContent);
    }

    return questionJson;
}

function sendEditRequest(body) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            reloadList();
            showSuccessPopup("Pomyslnie edytowano test: " + originalJson.name);
        }
    };

    var testId = originalJson.id;
    xhttp.open("PUT", "https://rj55i1bsub.execute-api.us-east-1.amazonaws.com/dev/tests?id=" + testId, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getRecruiterToken());

    console.log(JSON.stringify(body));

    xhttp.send(JSON.stringify(body));
}

function getRecruiterToken(){

    return sessionStorage.getItem('recruiterToken');

}

function getCandidateToken(){

    return sessionStorage.getItem('candidateToken');

}