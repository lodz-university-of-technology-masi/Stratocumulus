let questionsCount = 0;

function loadSampleTest() {
    let testJson =
        {
            "id": "2e67f777-b246-4af9-bc94-b63ec138c510",
            "language": "PL",
            "name": "Java ZMIANA",
            "questions": [
                {
                    "answers": [
                        "Metoda, która nie ma implementacji",
                        "Metoda z implementacją, w której wykorzystujemy jedynie klasy abstrakcyjne",
                        "Każda metoda klasy abstrakcyjnej",
                        "Inaczej nazywamy ją metodą generyczną"
                    ],
                    "content": "Co to jest metoda abstrakcyjna?",
                    "no": "1",
                    "numAnswers": 4,
                    "type": "c"
                },
                {
                    "content": "Wyjaśnij różnice między inner-join i outer-join.",
                    "no": "2",
                    "type": "o"
                },
                {
                    "content": "Jaką (maksymalnie) liczbę może przechowywać typ INT?",
                    "no": "3",
                    "type": "n"
                }
            ]
        };

    loadAddTest(testJson);
}

function loadAddTest(testJson) {
    questionsCount = 0;

    let name = testJson.name;
    let language = testJson.language;
    let questions = testJson.questions;

    $('#testNameInput').val(name);
    $('.select-language').val(language);

    displayLoadedInputs(questions);
    displayLoadedQuestions(questions);
}

function displayLoadedInputs(questions) {
    questions.forEach(function (question) {
        if (question.type === 'c') {
            addNewEmptyClosedQuestion();
        } else if (question.type === 'o') {
            addNewEmptyOpenQuestion();
        } else if (question.type === 'n') {
            addNewEmptyNumericQuestion();
        }
    });
}

function displayLoadedQuestions(questions) {
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

function addNewEmptyClosedQuestion() {
    questionsCount++;

    addNewEmptyClosedQuestion.counter++;
    let newDiv = document.createElement("div");
    newDiv.className = "question_div";
    let id = "q" + questionsCount.toString();
    let answer1Id = id + "a1";
    let answer2Id = id + "a2";
    let answer3Id = id + "a3";
    let answer4Id = id + "a4";
    let deleteButtonId = "d" + questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "       <nobr> <label class=\"question_label\">\n" +
        "            Treść pytania zamkniętego:\n" +
        "        </label>\n" +
        "        <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button> </nobr>\n" +
        "            <input class='closed' id='content" + questionsCount.toString() + "' type=\"text\">\n" +
        "<label class=\"question_label\">Warianty odpowiedzi:</label>" +
        "        <input id=\"" + answer1Id + "\" type=\"text\">" +
        "        <input id=\"" + answer2Id + "\" type=\"text\">" +
        "        <input id=\"" + answer3Id + "\" type=\"text\">" +
        "        <input id=\"" + answer4Id + "\" type=\"text\">";

    let questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function addNewEmptyOpenQuestion() {
    questionsCount++;

    addNewEmptyOpenQuestion.counter++;
    let newDiv = document.createElement("div");
    newDiv.className = "question_div";
    let id = "q" + questionsCount.toString();
    let deleteButtonId = "d" + questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "        <nobr>\n" +
        "            <label class=\"question_label\">\n" +
        "                Treść pytania otwartego:\n" +
        "            </label>\n" +
        "            <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button>\n" +
        "        </nobr>\n" +
        "        <input class='open' id='content" + questionsCount.toString() + "' type=\"text\">";

    let questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function addNewEmptyNumericQuestion() {
    questionsCount++;

    addNewEmptyOpenQuestion.counter++;
    let newDiv = document.createElement("div");
    newDiv.className = "question_div";
    let id = "q" + questionsCount.toString();
    let deleteButtonId = "d" + questionsCount.toString();
    newDiv.setAttribute("id", id);

    newDiv.innerHTML = "        <nobr>\n" +
        "            <label class=\"question_label\">\n" +
        "                Treść pytania liczbowego:\n" +
        "            </label>\n" +
        "            <button id=\"" + deleteButtonId + "\" type=\"button\" class=\"delete_question_button\" onclick=\"deleteQuestion(this)\">Usuń</button>\n" +
        "        </nobr>\n" +
        "        <input class='numeric' id='content" + questionsCount.toString() + "' type=\"text\">";

    let questionHr = document.getElementById("question_hr");
    questionHr.appendChild(newDiv);
}

function deleteQuestion(button) {
    let id = button.getAttribute("id").replace("d", "q");
    let questionLabel = document.getElementById(id);
    questionLabel.remove();
}

function handleAddTestButton(event) {
    let testName = $("#testNameInput").val();

    let questions = readQuestionsFromHtml();

    let testJson = {
        "name": testName,
        "language": $('.select-language').val(),
        "questions": questions,
        "recruiterEmail": getCurrentRecruiterEmail()
    };

    let validationMessage = validateTest(testName, questions);

    if (validationMessage === '') {
        clearIncludedView();
        sendAddRequest(testJson);
    } else {
        alert(validationMessage);
    }
}

function validateTest(content, questions) {
    let message = '';

    if (content === '') {
        message += 'Test nie może mieć pustego tytułu.\n'
    }

    for (let i=0; i<questions.length; i++) {
        let question = questions[i];
        if (question.content === '') {
            message += `Pytanie ${i+1} nie ma treści\n`;
        }
        if (question.type === 'c') {
            for (let q=0; q<question.answers.length; q++) {
                let answer = question.answers[q];
                if (answer === '') {
                    message += `Pytanie nr ${i+1} ma pustą odpowiedź nr ${q+1}\n`;
                }
            }
        }
    }

    return message;
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

function sendAddRequest(body) {
    callRecruiterAwsLambda("POST", "tests", afterAddTest, body, true, userRoles.RECRUITER);
}

function afterAddTest(response) {
    console.log(response);
    reloadList();
    showSuccessPopup("Pomyslnie dodano nowy test");
}