const sampleCandidateTests = {
    "assignedTests": [
        {
            "answers": [],
            "testId": "ebe49f58-409b-4e29-802f-d4ebce331cd1"
        }
    ],
    "candidateId": "f1a16aa7-dadb-4453-83a1-0f61785944bf"
};

const sampleTests = [
    {
        "id": "ebe49f58-409b-4e29-802f-d4ebce331cd1",
        "language": "PL",
        "name": "Tego testu nie ruszać bo jest dla Przemka",
        "questions": [
            {
                "answers": [
                    "A",
                    "B",
                    "C",
                    "D"
                ],
                "content": "Którą literę najbardziej lubisz?",
                "no": "1",
                "numAnswers": 4,
                "type": "c"
            },
            {
                "content": "Napisz coś o sobie",
                "no": "2",
                "type": "o"
            },
            {
                "content": "Ile masz lat?",
                "no": "3",
                "type": "n"
            }
        ]
    },
    {
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
            }
        ]
    }
];

let tests;
let candidateTests;
let candidateId;

function callAwsLambda(verb, endpoint, func, body, async) {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            func(this.responseText);
        }
    };

    xhttp.open(verb, `https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`, async);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getAccessToken());

    xhttp.send(JSON.stringify(body));
}

function simulation() {
    loadTests('f1a16aa7-dadb-4453-83a1-0f61785944bf', 'Adrian Warcholinski');
}

function getTests(response) {
    tests = JSON.parse(response);
}

function handleCandidateTests(response) {
    let allCandidateTests = JSON.parse(response);
    for (let i = 0; i < allCandidateTests.length; i++) {
        let currentCandidateTests = allCandidateTests[i];
        if (currentCandidateTests.candidateId === candidateId) {
            candidateTests = currentCandidateTests;
        }
    }
}

function loadTests(candId, candidateName) {
    candidateId = candId;
    $('#candidate-header').text(`Przypisz testy: ${candidateName}`);

    callAwsLambda('GET', 'tests', getTests, false);
    callAwsLambda('GET', 'candidatetests', handleCandidateTests, false);

    let testsData = getAllAndAssignedTestsIdsAndNames(tests, candidateTests);

    let allTests = testsData.all;
    let assignedTests = testsData.assignedTests;

    displayAllCheckboxs(allTests);
    checkAssignedCheckboxes(assignedTests);
}

function displayAllCheckboxs(tests) {
    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        displayTestCheckbox(test.id, test.name);
    }
}

function checkAssignedCheckboxes(assignedTests) {
    for (let i = 0; i < assignedTests.length; i++) {
        $(`#${assignedTests[i].id}`).prop('checked', true);
    }
}

function getAllAndAssignedTestsIdsAndNames(tests, candidateTests) {
    let allTests = [];
    let assignedTests = [];

    const numTests = tests.length;

    for (let i = 0; i < numTests; i++) {
        let test = tests[i];
        let idName = {
            "id": test.id,
            "name": test.name
        };
        allTests.push(idName);

        if (isAssignedTest(candidateTests, idName.id)) {
            assignedTests.push(idName);
        }
    }

    return {
        "all": allTests,
        "assignedTests": assignedTests
    };
}

function isAssignedTest(candidateTests, id) {
    const numAssignedTests = candidateTests.assignedTests.length;
    for (let i = 0; i < numAssignedTests; i++) {
        if (candidateTests.assignedTests[i].testId === id) {
            return true;
        }
    }

    return false;
}

function displayTestCheckbox(id, value) {
    const newTest = getCheckbox(id, value);

    $('#test-hr').append(newTest);
    displayLabel(newTest);
}

function getCheckbox(id, value) {
    return $(`<input id="${id}" class="test-checkbox" type="checkbox" value="${value}"/>`);
}

function displayLabel(test) {
    var label = $(`<label>${test.val()}</label>`);
    var br = $(`<br/>`);

    $('#test-hr').append(label).append(br);
}
