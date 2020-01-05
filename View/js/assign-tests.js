let tests;
let candidateTests;
let candidateId;

function afterGetTests(response) {
    tests = JSON.parse(response);
}

function afterGetCandidateTests(response) {
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

    callAwsLambda('GET', 'tests', afterGetTests, false);
    callAwsLambda('GET', 'candidatetests', afterGetCandidateTests, false);

    let testsData = getAllAndAssignedTestsIdsAndNames();

    let allTests = testsData.all;
    let assignedTests = testsData.assignedTests;

    displayAllCheckboxes(allTests);
    checkAssignedCheckboxes(assignedTests);
}

function displayAllCheckboxes(tests) {
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

    displayLabel(newTest, isTestSolved(id));
}

function getCheckbox(id, value) {
    return $(`<input id="${id}" class="test-checkbox" type="checkbox" value="${value}"/>`);
}

function getButton(id, text) {
    return $(`<button id="${id}" class=check-test-button type="button" onclick="handleCheckTestButton(this)">${text}</button>`);
}

function displayLabel(test, isIncludeCheckButton) {
    let label = $(`<label>${test.val()}</label>`);

    let testHr = $('#test-hr');
    testHr.append(label);

    if (isIncludeCheckButton) {
        testHr.append(getButton(`ct_${getAssignedTestByTestName(test.val()).id}`, 'Sprawdź test'));
    }

    testHr.append($('<br/>'));
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

function getAssignedTestByTestName(testName) {
    let numTests = tests.length;
    for (let i = 0; i < numTests; i++) {
        let test = tests[i];
        if (test.name === testName) {
            return test;
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

function afterUpdateAssignedTests(response) {
    let responseObject = JSON.parse(response);
    alert(responseObject.result ? 'Pomyślnie przypisano testy' : 'Nie udało się przypisać testów');
    window.location.href = 'MainView.html';
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

    callAwsLambda('PUT', `candidatetests?candidateId=${candidateId}`, afterUpdateAssignedTests, body, true);
}

function handleCheckTestButton(event) {
    let testId = event.id.replace('ct_', '');
    alert(`Sprawdź test: ${testId}`);
}