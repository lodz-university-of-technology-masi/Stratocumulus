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

function getCandidateTests(response) {
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
    callAwsLambda('GET', 'candidatetests', getCandidateTests, false);

    let testsData = getAllAndAssignedTestsIdsAndNames();

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
        let assignedTest = assignedTests[i];
        $(`#${assignedTests[i].id}`).prop('checked', true).attr('disabled', isTestSolved(assignedTest.id));
    }
}

function getAllAndAssignedTestsIdsAndNames() {
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

        if (isAssignedTest(idName.id)) {
            assignedTests.push(idName);
        }
    }

    return {
        "all": allTests,
        "assignedTests": assignedTests
    };
}

function isAssignedTest(id) {
    const numAssignedTests = candidateTests.assignedTests.length;
    for (let i = 0; i < numAssignedTests; i++) {
        if (candidateTests.assignedTests[i].testId === id) {
            return true;
        }
    }

    return false;
}

function isTestSolved(id) {
    const numAssignedTests = candidateTests.assignedTests.length;
    for (let i = 0; i < numAssignedTests; i++) {
        let assignedTest = candidateTests.assignedTests[i];
        if (assignedTest.testId === id) {
            return assignedTest.answers !== null;
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

function getAssignedTestByTestId(testId) {
    for (let i = 0; i < candidateTests.assignedTests.length; i++) {
        let assignedTest = candidateTests.assignedTests[i];
        if (assignedTest.testId === testId) {
            return assignedTest;
        }
    }

    return null;
}

function getEmptyAssignedTest(testId) {
    return {
        "testId": testId,
        "answers": null,
    }
}

function afterUpdate(response) {
    let responseObject = JSON.parse(response);
    if (responseObject.result) {
        alert('Pomyślnie przypisano testy');
    } else {
        alert('Nie udało się przypisać testów');
    }
}

function handleAssignTestsButton() {
    let assignedTests = [];

    $('.test-checkbox').each(function () {
        if (this.checked) {
            let testId = this.id;
            if (isAssignedTest(candidateTests, testId)) {
                let assignedTest = getAssignedTestByTestId(testId);
                assignedTests.push(assignedTest);
            } else {
                assignedTests.push(getEmptyAssignedTest(testId));
            }
        }
    });

    let body = {
        "assignedTests": assignedTests
    };

    callAwsLambda('PUT', `candidatetests?candidateId=${candidateId}`, afterUpdate, body, true);
}