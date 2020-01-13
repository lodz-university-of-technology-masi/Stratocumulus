var loadedTest;
var candidateTest;
var candidateId;
var questionsCount = 0;

function loadSolveTestContent(test, originalTest, id) {

    $('#test-header').text(`ROZWIĄZYWANIE TESTU: ${test.name}`);
    loadedTest = test;
    candidateTest = originalTest;
    candidateId = id;

    displayQuestions();
}

function displayQuestions() {
    let questions = loadedTest.questions;
    for (let i = 0; i < questions.length; i++) {
        displayQuestion(questions[i]);
    }

}

function displayQuestion(question) {
    questionsCount++;

    displayLabel(`${questionsCount}. ${question.content}`);

    if (question.type == 'c') {
        displayActiveCheckboxes(question);
    }
    if (question.type == 'o'){
        displayTextInput();
    }
    if (question.type == "n"){
        displayNumberInput();
    }

    $('#answers-hr').append($('<br/>'));

}


function displayActiveCheckboxes(question) {
    let answers = question.answers;
    for (let i = 0; i < answers.length; i++) {
        displayActiveCheckbox(`q${questionsCount}a${i}`, answers[i]);
    }

    $('#answers-hr').append($('<br/>'));
}

function displayActiveCheckbox(id, text) {
    const answer = getActiveCheckbox(id, text);
    $('#answers-hr').append(answer);

    displayLabel(text);
}



function getActiveCheckbox(id, value) {
    return $(`<input id="${id}" class="answer-checkbox result-input" type="checkbox"  value="${value}"/>`);
}

function  displayTextInput() {
    const field = getTextInput();
    $('#answers-hr').append(field);
}


function getTextInput() {
    return $(`<input class="result-input" type="text"/>`);
}

function  displayNumberInput() {
    const field = getNumberInput();
    $('#answers-hr').append(field);
}

function getNumberInput(){
    return $(`<input class="result-input" type="number"/>`);
}



function displayLabel(text, type) {
    let label = $(`<label>${text}</label>`).attr({class:type});

    $('#answers-hr').append(label).append($('<br/>'));
}



function resetSolveTest () {
    questionsCount = 0;
}

function handleSendTestButton(){

    let checkboxArr = [];

    let answersArr = [];
    $('.result-input').each(function (index) {
        if (this.type=="checkbox") {

            let id = parseCheckboxId(this.id);

            if(id.answer== 0)
            {
                checkboxArr = [];
            }

            if(this.checked== true)
               checkboxArr.push(id.answer+1);

            if(id.answer + 1 == loadedTest.questions[id.question-1].numAnswers)
            {
               let answerString =  "[" + checkboxArr.join(',') + "]";
               answersArr.push(answerString);
            }




        }
        else
           answersArr.push(this.value);
    });



    sendAnswers(answersArr);
}

function sendAnswers(answersArr){

    let newTest = {};
    newTest.answers = answersArr;
    newTest.testId = candidateTest.testId;

   console.log(candidateTest);

   console.log(newTest);

   callCandidateAwsLambda('PUT', 'candidatetests?=' + userId + '_' + candidateTest.testId, null, newTest, false, userRoles.CANDIDATE);
}

function parseCheckboxId (id){

    let parsedId = {};
    parsedId.question =  parseInt(id.substring(id.indexOf("q") + 1, id.indexOf("a")));
    parsedId.answer = parseInt(id.split('a')[1]);
    return parsedId;
}

