/*
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

  loadContent(sampleTest, sampleAnswers, sampleCandidateId);

}

*/



var loadedTest;
var answers;
var marks;
var candidateId;
var maxScore = 10 ;


var questionsCount = 0;
var testScore = 0;


function assignParams(orginalTest, answersGiven, results) {
    loadedTest = orginalTest;
    answers = answersGiven;
    marks = results;
}


function loadViewMarksContent(test, answers, results) {

    assignParams(test, answers, results);
    $('#test-header').text(`Wyniki Testu: ${test.name}`);

    displayQuestionsAndMarks();

}

function displayQuestionsAndMarks() {
    let questions = loadedTest.questions;
    for (let i = 0; i < questions.length; i++) {
        displayQuestionAndMark(questions[i]);
    }

    displayLabel("TOTAL SCORE: " + testScore + "/" + maxScore*questionsCount, "score" );
}

function displayQuestionAndMark(question) {
    questionsCount++;

    displayLabel(`${questionsCount}. ${question.content}`);

    if (question.type === 'c') {
        displayCheckboxes(question);
        checkChosenAnswers();
    } else {
        displayLabel(`Odpowiedź: ${answers[questionsCount - 1]}`);
    }

    testScore += marks[questionsCount -1];

    displayLabel("OCENA: " + marks[questionsCount - 1] + "/" + maxScore,"score")

    $('#answers-hr').append($('<br/>'));

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

function displayLabel(text, type) {
    let label = $(`<label>${text}</label>`).attr({class:type});

    $('#answers-hr').append(label).append($('<br/>'));
}

function resetViewMarks() {
    testScore = 0;
    questionsCount = 0;
}

function getAnswers(){

}
