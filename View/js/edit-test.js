let _originalJson;

let ___questionsCount = 0;

function loadEditTest(testJson) {
    _originalJson = testJson;

    ___questionsCount = 0;

    let name = testJson.name;
    let language = testJson.language;
    let questions = testJson.questions;

    $('#testNameInput').val(name);
    $('.select-language').val(language);

    displayInputs(questions);
    _displayQuestions(questions);
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

function _displayQuestions(questions) {
    $('[id^=content]').each(function (index) {
        let question = questions[index];
        this.value = question.content;

        if (this.className === 'closed') {
            for (let i = 0; i < 4; i++) {
                let answerContent = question.answers[i];
                let answerId = 'q' + (index + 1) + 'a' + (i + 1).toString();
                $('#' + answerId).val(answerContent);
            }
        }
    });
}

function addNewClosedQuestion() {
    ___questionsCount++;

    addNewClosedQuestion.counter++;
    let newDiv = document.createElement("div");
    newDiv.className = "question_div";
    let id = "q" + ___questionsCount.toString();
    let answer1Id = id + "a1";
    let answer2Id = id + "a2";
    let answer3Id = id + "a3";
    let answer4Id = id + "a4";
    let deleteButtonId = "d" + ___questionsCount.toString();
    let contentId = 'content' + ___questionsCount.toString();
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

    let questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function addNewOpenQuestion() {
    ___questionsCount++;

    addNewOpenQuestion.counter++;
    let newDiv = document.createElement("div");
    newDiv.className = "question_div";
    let id = "q" + ___questionsCount.toString();
    let deleteButtonId = "d" + ___questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "        <nobr>\n" +
        "            <label class=\"question_label\">\n" +
        "                Treść pytania otwartego:\n" +
        "            </label>\n" +
        "            <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button>\n" +
        "        </nobr>\n" +
        "        <input class='open' id='content" + ___questionsCount.toString() + "' type=\"text\">";

    let questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function addNewNumericQuestion() {
    ___questionsCount++;

    addNewOpenQuestion.counter++;
    let newDiv = document.createElement("div");
    newDiv.className = "question_div";
    let id = "q" + ___questionsCount.toString();
    let deleteButtonId = "d" + ___questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "        <nobr>\n" +
        "            <label class=\"question_label\">\n" +
        "                Treść pytania liczbowego:\n" +
        "            </label>\n" +
        "            <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button>\n" +
        "        </nobr>\n" +
        "        <input class='numeric' id='content" + ___questionsCount.toString() + "' type=\"text\">";

    let questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function deleteQuestion(button) {
    let id = button.getAttribute("id").replace("d", "q");
    let questionLabel = document.getElementById(id);
    questionLabel.remove();
}

function getFilledTestJson() {
    let testName = $("#testNameInput").val();

    let modifiedJson = {
        "name": testName,
        "language": $(".select-language").val(),
        "questions": readQuestionsFromHtml(),
    };

    return modifiedJson;
}

function handleSaveTestButton(event) {
    let json = getFilledTestJson();

    json.recruiterEmail = getCurrentRecruiterEmail();

    let validationMessage = validateTest(json.name, json.questions);

    if (validationMessage === '') {
        clearIncludedView();
        sendEditRequest(json);
    } else {
        alert(validationMessage);
    }
}

function handleDeleteTestButton(event) {
    let testId = _originalJson.id;
    callRecruiterAwsLambda("DELETE", `tests?id=${testId}`, afterDeleteTest, '', true, userRoles.RECRUITER);
    clearIncludedView();
}

function afterDeleteTest(response) {
    reloadList();
    showSuccessPopup("Pomyslnie usunieto test: " + _originalJson.name);
}

function handleTranslateManuallyButton(event) {
    let json = getFilledTestJson();

    if (json.language === 'PL') {
        json.language = 'EN';
    } else {
        json.language = 'PL';
    }

    clearIncludedView();
    showAddTestView(json);
}

function handleAutoTranslateButton(event) {
    let json = getFilledTestJson();

    let translateLang = json.language === 'PL' ? 'pl-en' : 'en-pl';

    autoTranslate(translateLang, json);
}

function autoTranslate(translateLang, testJson) {
    callRecruiterAwsLambda("POST", `translate-test?lang=${translateLang}`, afterAutoTranslate, testJson, true, userRoles.RECRUITER);
}

function afterAutoTranslate(response) {
    clearIncludedView();
    showAddTestView(JSON.parse(response));
}

function readQuestionsFromHtml() {
    let questionsJson = [];

    $('[id^=content]').each(function (index) {
        let questionContent = this.value;
        let questionNo = this.id.replace("content", "");

        let questionJson = {
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

    for (let i = 0; i < 4; i++) {
        let answerId = 'q' + questionNo + 'a' + (i + 1).toString();
        let answerContent = $('#' + answerId).val();
        questionJson.answers.push(answerContent);
    }

    return questionJson;
}

function sendEditRequest(body) {
    callRecruiterAwsLambda("PUT", `tests?id=${_originalJson.id}`, afterEditTest, body, true, userRoles.RECRUITER);
}

function afterEditTest(response) {
    reloadList();
    showSuccessPopup("Pomyślnie edytowano test: " + _originalJson.name);
}