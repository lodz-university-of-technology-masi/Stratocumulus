var questionsCount = 0;

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

function deleteQuestion(button) {
    var id = button.getAttribute("id").replace("d", "q");
    var questionLabel = document.getElementById(id);
    questionLabel.remove();
}

function handleAddTestButton(event) {
    var testName = $("#testNameInput").val();


    var testJson = {
        "name": testName,
        "language": "PL",
        "questions": JSON.stringify(readQuestionsFromHtml())
    };

    console.log(testJson);

    sendRequest(testJson);
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
            questionJson.type = 'o';
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

function sendRequest(body) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
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