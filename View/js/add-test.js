var questionsCount = 0;

function loadSampleTest() {
    var testJson =
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

    loadTest(testJson);
}

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

function handleAddTestButton(event) {
    var testName = $("#testNameInput").val();

    var testJson = {
        "name": testName,
        "language": $('.select-language').val(),
        "questions": readQuestionsFromHtml()
    };

    console.log(testJson);

    clearIncludedView();
    sendAddRequest(testJson);
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

function sendAddRequest(body) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            reloadList();
            showSuccessPopup("Pomyslnie dodano nowy test");
        }

    };

    xhttp.open("POST", "https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/tests", true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getAccessToken());

    xhttp.send(JSON.stringify(body));
}

function getAccessToken() {
    var email = 'adrianwarcholinski9@gmail.com';
    var password = 'Qwerty123';

    var cognitoUser = getCognitoUser(email);

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function printOkMessage() {
            console.log('Authenticated successfully')
        },
        onFailure: function printFailedMessage() {
            console.log('Authentication failed')
        }
    });

    var token;

    cognitoUser.getSession(function (err, session) {
        if (!err) {
            token = session.getIdToken().getJwtToken();
        }
    });

    return token;
}

function getCognitoUser(email) {
    var poolData = {
        UserPoolId: 'us-east-1_CY4O3GKHV',
        ClientId: 'thcc01b1nkqm7fti3p434r7un'
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
}