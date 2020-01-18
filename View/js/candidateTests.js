var closebtns = document.getElementsByClassName("close");
var i;
var originalCandidateTestList;
let userTestsAndAnswers = {};
let userId;



var sampleCandidateID = "f1a16aa7-dadb-4453-83a1-0f61785944bf";

function loadEditPage() {
        window.location.href = "view-and-edit-candidate.html";
}

function getCognitoUser() {
    var poolData = {
        UserPoolId: 'us-east-1_CY4O3GKHV',
        ClientId: 'thcc01b1nkqm7fti3p434r7un'
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                alert(err);
                return;
            }
            console.log('session validity: ' + session.isValid());
            document.getElementById("labelName").innerHTML = cognitoUser.getUsername();
        });
    }
    else {
        alert("Blad pobierania uzytkownika!");
    }

    return cognitoUser;
}

function getAuthToken(user) {

    user.getSession(function (err, session) {
        if (err) {
            console.log('Error');
        } else {
            console.log(':)')
            idToken = session.getIdToken().getJwtToken();
        }
    });
    return idToken;
}


function getUserIdFromCognito() {

    let cognitoUser = getCognitoUser();
    console.log(cognitoUser);
    callCandidateAwsLambda("GET", `candidate?email=${cognitoUser.getUsername()}`, afterGetUserId, '', false, userRoles.CANDIDATE);
}



function afterGetUserId(response) {
    let user = JSON.parse(response);
    console.log(user);
    userId = user.id;
}

function logOut() {

    var cognitoUser = getCognitoUser();

    cognitoUser.globalSignOut(
        {
            onFailure: e => alert("Blad podczas wylogowywania!")
            , onSuccess: r => {
                window.location.href = 'index.html';
                alert("Wylogowano poprawnie!")
            }
        }
    )

}

function log (text)
{
    console.log(text);
}


function loadTests() {

  getUserIdFromCognito();
  
    console.log("candidatetest?candidateId=" + userId);
    callCandidateAwsLambda("GET", "candidatetest?candidateId=" + userId, loadUserTests, "", false, userRoles.CANDIDATE);

    log(userTestsAndAnswers);

    populateTestList(userTestsAndAnswers);

  //  reloadStylesheets();

}

function reloadStylesheets() {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}

function loadUserTests(response)
{
    originalCandidateTestList = JSON.parse(response);
   let userAnswers = originalCandidateTestList.assignedTests;

    for(let i = 0 ; i< userAnswers.length ; i++) {
        let userTestAndAnswer = {};
        userTestAndAnswer.Answers = userAnswers[i];
        userTestAndAnswer.Index = i;
        userTestAndAnswer.Test = null;
        userTestAndAnswer.Results = null;
        userTestsAndAnswers[userAnswers[i].testId] = userTestAndAnswer;

        callCandidateAwsLambda("GET", "test?id=" + userAnswers[i].testId, pushTestList, "", false, userRoles.CANDIDATE);
        callCandidateAwsLambda('GET', "result?id=" + userId + "_" + userAnswers[i].testId, function (response) {
            console.log(response);
            if (response != '')
                userTestAndAnswer.Results = JSON.parse(response);
        }, "", false, userRoles.CANDIDATE);
    }


}



function pushTestList(test)
{
    let userTest = JSON.parse(test);
    userTestsAndAnswers[userTest.id].Test= userTest;
}

function populateTestList(testsAndAnswersList) {

    document.getElementById("candidateTestList").innerHTML = "";


    for ( let key in testsAndAnswersList) {


        let btn = document.createElement("BUTTON");

        btn.innerHTML = testsAndAnswersList[key].Test.name;

        if(testsAndAnswersList[key].Results == null && testsAndAnswersList[key].Answers.answers == null){

            btn.disabled=false;
            clearElementClassList(btn,"unsolvedTest",["markedTest","solvedTest"])

            btn.onclick = function () {
              changeToSolveView(testsAndAnswersList[key]);
            };


        }
        else if(testsAndAnswersList[key].Results == null && testsAndAnswersList[key].Answers.answers != null) {
            btn.disabled = true;

            clearElementClassList(btn,"solvedTest",["markedTest","unsolvedTest"])
        }

        else if(testsAndAnswersList[key].Results != null &&  testsAndAnswersList[key].Answers.answers != null)
        {
            btn.disabled = false;

            clearElementClassList(btn,"markedTest",["solvedTest","unsolvedTest"])

            btn.onclick = function () {
                changeToViewMarksView(testsAndAnswersList[key]);
            };
        }
        else
        {
            console.log('NIEKOMPATYBILNOSC W BAZIE DANYCh!!!!!');
        }


        let li = document.createElement("li");
        li.appendChild(btn);

        document.getElementById("candidateTestList").appendChild(li);
    }


}

function clearElementClassList(element,classToAdd, ListToRemove){


    for(let i = 0; i<ListToRemove.length;i++)
    {
        if(element.classList.contains(ListToRemove[i]))
            element.classList.remove(ListToRemove[i]);
    }

    element.classList.add(classToAdd);
}



function changeToSolveView (testAndAnswers)
{
    clearIncludedView();


    $('#includedContent').load("solveTest.html",function (){
        resetSolveTest();
        loadSolveTestContent(testAndAnswers.Test, testAndAnswers.Answers, testAndAnswers.Index);
    });
}

function changeToViewMarksView(testAndAnswers)
{
    clearIncludedView();


    $('#includedContent').load("view-marks.html",function (){
        resetViewMarks();
        loadViewMarksContent(testAndAnswers.Test,testAndAnswers.Answers.answers, testAndAnswers.Results.results);
    });
}

function clearIncludedView(){
    $('#includedContent').empty();
}
