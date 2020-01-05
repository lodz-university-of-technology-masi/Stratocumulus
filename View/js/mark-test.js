let sampleTest = {
    "id": "2e67f777-b246-4af9-bc94-b63ec138c510",
    "language": "PL",
    "name": "Java",
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
        },
        {
            "content": "Opisz język C#.",
            "no": "4",
            "type": "o"
        }
    ]
};

let sampleAnswers = [
    "[1, 3]",
    "Nie ma żadnej różnicy",
    "50000",
    " "
];

let sampleCandidateId = "f1a16aa7-dadb-4453-83a1-0f61785944bf";

function simulate() {
    loadTestAndAnswers(sampleTest, sampleAnswers, sampleCandidateId);
}

// Above code will be removed in the future

let test;
let answers;
let candidateId;

let questionsCount = 0;

function assignParams(testToCheck, answersToCheck, candId) {
    test = testToCheck;
    answers = answersToCheck;
    candidateId = candId;
}

function loadTestAndAnswers(test, answers, candidateId) {
    assignParams(test, answers, candidateId);

    $('#test-header').text(`Oceń test: ${test.name}`);

    displayQuestions();
}

function displayQuestions() {
    let questions = test.questions;
    for (let i = 0; i < questions.length; i++) {
        displayQuestion(questions[i]);
    }
}

function displayQuestion(question) {
    questionsCount++;

    displayLabel(`${questionsCount}. ${question.content}`);

    if (question.type === 'c') {
        displayCheckboxes(question);
        checkChosenAnswers();
    } else {
        displayLabel(`Odpowiedź: ${answers[questionsCount - 1]}`);
    }

    displayResultTextBox();
    $('#answers-hr').append($('<br/>'));

}

function displayResultTextBox() {
    $('#answers-hr').append(getNumberInput(`r${questionsCount}`, 'Ocena: '));
}

function getNumberInput(id, text) {
    return $(`<div><label>${text}</label><input id="${id}" class="result-input" value="0" type="number" min="0" max="10"></><label>/10</label></div>`);
}

function checkChosenAnswers() {
    let answersIds = JSON.parse(answers[questionsCount - 1]);
    for (let i = 0; i < answersIds.length; i++) {
        let answerId = answersIds[i];
        $(`#q${questionsCount}a${answerId - 1}`).prop('checked', true);
    }
}

function displayCheckboxes(question) {
    let answers = question.answers;
    for (let i = 0; i < answers.length; i++) {
        displayCheckbox(`q${questionsCount}a${i}`, answers[i]);
    }

    $('#answers-hr').append($('<br/>'));
}

function displayCheckbox(id, text) {
    const answer = getCheckbox(id, text);
    $('#answers-hr').append(answer);

    displayLabel(text);
}

function getCheckbox(id, value) {
    return $(`<input id="${id}" class="answer-checkbox" type="checkbox" disabled="true" value="${value}"/>`);
}

function displayLabel(text) {
    let label = $(`<label>${text}</label>`);

    $('#answers-hr').append(label).append($('<br/>'));
}

function handleSaveMarksButton() {
    let results = getResults();

    if (results.invalidAnswersIds.length === 0) {
        let body = {
            "results": results.resultsArray
        };

        // callAwsLambda('POST', 'results', afterSave, body, true);
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
        resultsArray.push(this.value);
    });

    return {
        "resultsArray": resultsArray,
        "invalidAnswersIds": invalidAnswersIds
    }
}

function afterSave(response) {
    let responseObject = JSON.parse(response);
    if (responseObject.result) {
        alert('Pomyślnie zapisano oceny');
    } else {
        alert('Nie udało się zapisać ocen');
    }
}