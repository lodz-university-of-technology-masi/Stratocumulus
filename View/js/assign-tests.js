let __tests;
let __candidateTests;
let __candidateId;
let __testResults;

function afterGetTests(response) {
    __tests = JSON.parse(response);
}

function afterGetCandidateTests(response) {
    let allCandidateTests = JSON.parse(response);
    for (let i = 0; i < allCandidateTests.length; i++) {
        let currentCandidateTests = allCandidateTests[i];
        if (currentCandidateTests.candidateId === __candidateId) {
            __candidateTests = currentCandidateTests;
        }
    }
}

function afterGetResults(response) {
    let testResults = [];
    let allResults = JSON.parse(response);
    for (let i = 0; i < allResults.length; i++) {
        let result = allResults[i];
        if (result.id.includes(__candidateId)) {
            testResults.push(result);
        }
    }

    __testResults = testResults;
}

function loadTests(candId, candidateName) {
    __candidateId = candId;
    $('#candidate-header').text(`Przypisz testy: ${candidateName}`);

    let email = getCurrentRecruiterEmail();

    callRecruiterAwsLambda('GET', `tests?recruiterEmail=${email}`, afterGetTests, false);
    callRecruiterAwsLambda('GET', 'candidatetests', afterGetCandidateTests, false);
    callRecruiterAwsLambda('GET', 'results', afterGetResults, false);

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

    const numTests = __tests.length;

    for (let i = 0; i < numTests; i++) {
        let test = __tests[i];
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
    const numAssignedTests = __candidateTests.assignedTests.length;
    for (let i = 0; i < numAssignedTests; i++) {
        if (__candidateTests.assignedTests[i].testId === id) {
            return true;
        }
    }

    return false;
}

function isTestSolved(id) {
    const numAssignedTests = __candidateTests.assignedTests.length;
    for (let i = 0; i < numAssignedTests; i++) {
        let assignedTest = __candidateTests.assignedTests[i];
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
    let onClick = `${getTestResultByTestId(id) !== null ? 'handleShowMarksButton(this)' : 'handleCheckTestButton(this)'}`;
    return $(`<button id="${id}" class=check-test-button type="button" onclick=${onClick}>${text}</button>`);
}

function displayLabel(testCheckbox, isIncludeCheckButton) {
    let label = $(`<label>${testCheckbox.val()}</label>`);

    let testHr = $('#test-hr');
    testHr.append(label);

    if (isIncludeCheckButton) {
        let test = getAssignedTestByTestName(testCheckbox.val());
        testHr.append(getButton(`ct_${test.id}`, getTestResultByTestId(test.id) !== null ? 'Zobacz ocenę' : 'Oceń test'));
    }

    testHr.append($('<br/>'));
}

function getTestResultByTestId(testId) {
    let id = `${__candidateId}_${testId}`;
    for (let i = 0; i < __testResults.length; i++) {
        if (__testResults[i].id === id) {
            return __testResults[i];
        }
    }

    return null;
}

function getAssignedTestByTestId(testId) {
    for (let i = 0; i < __candidateTests.assignedTests.length; i++) {
        let assignedTest = __candidateTests.assignedTests[i];
        if (assignedTest.testId === testId) {
            return assignedTest;
        }
    }

    return null;
}

function getAssignedTestByTestName(testName) {
    let numTests = __tests.length;
    for (let i = 0; i < numTests; i++) {
        let test = __tests[i];
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
            if (isAssignedTest(testId)) {
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

    callRecruiterAwsLambda('PUT', `candidatetests?candidateId=${__candidateId}`, afterUpdateAssignedTests, body, true, userRoles.RECRUITER);
}

function getTestById(id) {
    for (let i = 0; i < __tests.length; i++) {
        if (__tests[i].id === id) {
            return __tests[i];
        }
    }

    return null;
}

function getAnswersByTestId(id) {
    for (let i = 0; i < __candidateTests.assignedTests.length; i++) {
        let assignedTest = __candidateTests.assignedTests[i];
        if (assignedTest.testId === id) {
            return assignedTest.answers;
        }
    }

    return null;
}

function afterGetAnswers(response) {
    if (response !== '') {
        __testResults = JSON.parse(response);
    }
}

function getPoints(testId) {
    for (let i=0; i<__testResults.length; i++) {
        let id = `${__candidateId}_${testId}`;
        if (__testResults[i].id === id) {
            return __testResults[i].results;
        }
    }

    return null;
}

function handleCheckTestButton(event) {
    let testId = event.id.replace('ct_', '');
    showMarkTestView({
        "test": getTestById(testId),
        "answers": getAnswersByTestId(testId),
        "candidateId": __candidateId,
        "points": getPoints(testId)
    })
}

function handleShowMarksButton(event) {
    let testId = event.id.replace('ct_', '');
    showMarkTestView({
        "test": getTestById(testId),
        "answers": getAnswersByTestId(testId),
        "candidateId": __candidateId,
        "points": getPoints(testId)
    });
}