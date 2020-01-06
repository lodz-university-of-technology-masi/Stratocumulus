let _test;
let _answers;
let _candidateId;

let _questionsCount = 0;
let _results;

function assignParams(testToCheck, answersToCheck, candId) {
    _test = testToCheck;
    _answers = answersToCheck;
    _candidateId = candId;
}

function loadTestAndAnswers(test, answers, candidateId, points) {
    assignParams(test, answers, candidateId);

    _questionsCount = 0;

    $('#test-header').text(points === undefined ? `Wpisz oceny: ${test.name}` : `Zobacz oceny: ${test.name}`);

    displayQuestions();

    if (points !== null) {
        _results = points;
        $('#save-marks-button').remove();

        $('.result-input').each(function (index) {
            this.value = _results[index];
            this.disabled = true;
        })
    }
}

function displayQuestions() {
    let questions = _test.questions;
    for (let i = 0; i < questions.length; i++) {
        displayQuestion(questions[i]);
    }
}

function displayQuestion(question) {
    _questionsCount++;

    displayQuestionLabel(`${_questionsCount}. ${question.content}`);

    if (question.type === 'c') {
        displayCheckboxes(question);
        checkChosenAnswers();
    } else {
        displayQuestionLabel(`Odpowiedź: ${_answers[_questionsCount - 1]}`);
    }

    displayResultTextBox();
    $('#answers-hr').append($('<br/>'));

}

function displayResultTextBox() {
    $('#answers-hr').append(getNumberInput(`r${_questionsCount}`, 'Ocena: '));
}

function getNumberInput(id, text) {
    return $(`<div><label>${text}</label><input id="${id}" ${_results !== undefined ? 'disabled' : ''} class="result-input" value="0" type="number" min="0" max="10"></><label>/10</label></div>`);
}

function checkChosenAnswers() {
    let answersIds = JSON.parse(_answers[_questionsCount - 1]);
    for (let i = 0; i < answersIds.length; i++) {
        let answerId = answersIds[i];
        $(`#q${_questionsCount}a${answerId - 1}`).prop('checked', true);
    }
}

function displayCheckboxes(question) {
    let answers = question.answers;
    for (let i = 0; i < answers.length; i++) {
        displayCheckbox(`q${_questionsCount}a${i}`, answers[i]);
    }

    $('#answers-hr').append($('<br/>'));
}

function displayCheckbox(id, text) {
    const answer = getMarkCheckbox(id, text);
    $('#answers-hr').append(answer);

    displayQuestionLabel(text);
}

function getMarkCheckbox(id, value) {
    return $(`<input id="${id}" class="answer-checkbox" type="checkbox" disabled value="${value}"/>`);
}

function displayQuestionLabel(text) {
    let label = $(`<label>${text}</label>`);

    $('#answers-hr').append(label).append($('<br/>'));
}

function handleSaveMarksButton() {
    let results = getResults();

    if (results.invalidAnswersIds.length === 0) {
        let body = {
            "candidateId": _candidateId,
            "testId": _test.id,
            "points": results.resultsArray,
        };

        alert(JSON.stringify(body));

        callAwsLambda('POST', 'results', afterSave, body, false);
        window.location.href = 'MainView.html';
    } else {
        let message = 'Nieprawidłowe odpowiedzi na pytania o numerach: ';
        for (let i = 0; i < results.invalidAnswersIds.length; i++) {
            message += `${results.invalidAnswersIds[i]} `;
        }
        alert(message);
    }
}

function getResults() {
    let resultsArray = [];
    let invalidAnswersIds = [];
    $('.result-input').each(function (index) {
        if (this.value < 0 || this.value > 10 || this.value === "") {
            invalidAnswersIds.push(index + 1);
        }
        resultsArray.push(parseInt(this.value));
    });

    return {
        "resultsArray": resultsArray,
        "invalidAnswersIds": invalidAnswersIds
    }
}

function afterSave(response) {
    alert('Zapisano oceny');
}