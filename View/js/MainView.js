function showTests() {
    var x = document.getElementById("UserContentId");
    var y = document.getElementById("TestContentId");

    x.style.display = "none";
    y.style.display = "block";
}

function showUsers() {
    var x = document.getElementById("TestContentId");
    var y = document.getElementById("UserContentId");

    x.style.display = "none";
    y.style.display = "block";
}


function onPageLoad() {
    reloadList();
    getUserList();
}

function reloadList() {

    let response = '';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            response = this.responseText;
            console.log(this.responseText);
            populateTestList(JSON.parse(response));
        }
    };

    xhttp.open("GET", "https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/tests", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getAccessToken());
    xhttp.send();


}


function populateTestList(testList) {

    document.getElementById("TestListId").innerHTML = "";

    for (let i = 0; i < testList.length; i++) {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = testList[i].name;

        btn.onclick = function () {
            showEditTestView(testList[i])
        };

        let li = document.createElement("li");
        li.appendChild(btn);
        document.getElementById("TestListId").appendChild(li);
    }
}

function populateUserList(userList) {

    document.getElementById("UserListId").innerHTML = "";

    for (let i = 0; i < userList.length; i++) {
        let btn = document.createElement("BUTTON");
        btn.innerHTML = userList[i].name;

        btn.onclick = function () {
            showDetailsUserView(userList[i])
        };

        let li = document.createElement("li");
        li.appendChild(btn);
        document.getElementById("UserListId").appendChild(li);
    }

}

function clearIncludedView() {
    $("#includedContent").empty();
}

function showAddTestView(testObject) {
    $("#includedContent").load("add-test.html",function () {
        if(testObject!=null)
            loadTest(testObject);
            });



}

function showAddUserView() {
    $("#includedContent").load("add-candidate.html");

}

function showEditTestView(testObject) {
    $("#includedContent").load("edit-test.html", function () {
        loadTest(testObject);
    });
}

function showDetailsUserView(testObject) {
    $("#includedContent").load("view-single.html", function () {
        loadData(testObject);
    });
}


function showSuccessPopup(text) {
    document.getElementById("AlertMsg").innerText = text;
    document.getElementById("AlertMsg").parentElement.style.display = "inline-block";

}

function getAccessToken() {

    var poolData = {
        UserPoolId: 'us-east-1_CY4O3GKHV',
        ClientId: 'thcc01b1nkqm7fti3p434r7un'
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var email = 'adrianwarcholinski9@gmail.com';
    var password = 'Qwerty123';

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function printOkMessage() {
            console.log('Authenticated successfully')
        },
        onFailure: function printFailedMessage() {
            console.log('Authentication failed')
        }
    });

    var idToken;

    cognitoUser.getSession(function (err, session) {
        if (err) {
            console.log('Error');
        } else {
            console.log(':)')
            idToken = session.getIdToken().getJwtToken();
        }
    });

    return idToken;
}

function getUserList() {
    let userList = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {


        if (this.readyState === 4 && this.status === 200) {
            userList = this.responseText;
            console.log(this.responseText);
            populateUserList(JSON.parse(userList));
        }
    };

    xhttp.open("GET", "https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/candidates", true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getAccessToken());

    xhttp.send();
}

function handleImport(fileList) {
    console.log(fileList[0].name);

    var reader = new FileReader();

    reader.onload = function () {
        console.log(reader.result);
        parseCsv(reader.result, fileList[0].name);

    };

    reader.readAsText(fileList[0]);
}

function parseCsv(text, name) {
    let lines = text.split('\n');


    let test = new Object();
    test.name = name;


    let questions = [];

    let language = '';

    let language_err = false;

    for (let i = 0; i < lines.length; i++) {


        let start_pos = lines[i].indexOf('"') + 1;
        let end_pos = lines[i].indexOf('"', start_pos);
        let text_to_get = lines[i].substring(start_pos, end_pos);


        if (text_to_get !== "") {
            let fragments = text_to_get.split(";");
            let question = new Object();

            question.no = fragments[0];

            //ToDo: Poprawic kiedy będzie juztyp liczbowy

            if (fragments[1] === 'W')
                question.type = 'c';
            if (fragments[1] === 'O')
                question.type = 'o';
            if (fragments[1] === "L")
                question.type = 'n';

            console.log(i);
            console.log(language);
            console.log(fragments[2]);

            if (language === '') {
                language = fragments[2];
            } else if (language !== fragments[2]) {
                language_err = true;
            }

            question.content = fragments[3];

            if (question.type === "c") {
                question.numAnswers = fragments[4]
                question.answers = [];
                for (let k = 0; k < question.numAnswers; k++)
                    question.answers.push(fragments[5 + k]);

            }

            if (question.type === "c" && fragments[4] !== "|") {
                // Some error
            }
            questions.push(question);
        }
    }

    if (language_err === true) {
        // niespojnojsc jezyka
    }

    test.language = language;
    test.questions = JSON.stringify(questions);
    console.log(JSON.stringify(test));
    sendAddRequest(test);


}

function logOutUser() {

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
