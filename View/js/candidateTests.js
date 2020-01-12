var closebtns = document.getElementsByClassName("close");
var i;

var userId;
let userTestsAndAnswers = {};




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

    var cognitoUser = getCognitoUser();
    var userEmail = cognitoUser.getUsername();
    var user = '';
    var idToReturn;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            user = this.responseText;
            console.log(this.responseText);
            var parsed = JSON.parse(user);
            idToReturn = parsed.id;
        }
    };

    xhttp.open("GET", "https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/candidate?email=" + userEmail, false);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getCandidateToken());

    xhttp.send();

    return idToReturn;

}

function getRecruiterToken(){

    return sessionStorage.getItem('recruiterToken');

}

function getCandidateToken(){

    return sessionStorage.getItem('candidateToken');

}

function getUserIdAndReturn(parsed){
alert(parsed.id);
    return parsed.id;
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


    userId = sampleCandidateID;
   // userId = getUserIdFromCognito();

    callAwsLambda("GET", "candidatetest?candidateId=" + userId, loadUserTests,"",false);

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
   let userAnswers = JSON.parse(response).assignedTests;

    for(let i = 0 ; i< userAnswers.length ; i++)
    {
        let userTestAndAnswer =  {};
        userTestAndAnswer.Answers = userAnswers[i];
        userTestAndAnswer.Test = null;
        userTestAndAnswer.Results = null;
        userTestsAndAnswers[userAnswers[i].testId] = userTestAndAnswer;

        callAwsLambda("GET", "test?id=" + userAnswers[i].testId, pushTestList,"",false);
        callAwsLambda('GET', "result?id="+userId+"_"+userAnswers[i].testId,  function(response){
            console.log(response);
            if(response!='')
            userTestAndAnswer.Results = JSON.parse(response);
        },"",false);
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

        if(testsAndAnswersList[key].Results == null && testsAndAnswersList[key].Answers.answers != null) {
            btn.disabled = true;

            clearElementClassList(btn,"solvedTest",["markedTest","unsolvedTest"])
        }

        if(testsAndAnswersList[key].Results != null)
        {
            btn.disabled = false;

            clearElementClassList(btn,"markedTest",["solvedTest","unsolvedTest"])

            btn.onclick = function () {
                changeToViewMarksView(testsAndAnswersList[key]);
            };
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
    $('#includedContent').empty();


    $('#includedContent').load("solveTest.html",function (){
        resetSolveTest();
        loadSolveTestContent(testAndAnswers.Test, testAndAnswers.Answers,userId);
    });
}

function changeToViewMarksView(testAndAnswers)
{
    $('#includedContent').empty();


    $('#includedContent').load("view-marks.html",function (){
        resetViewMarks();
        loadViewMarksContent(testAndAnswers.Test,testAndAnswers.Answers.answers, testAndAnswers.Results.results);
    });
}

