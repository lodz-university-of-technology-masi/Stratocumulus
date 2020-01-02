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

function clearIncludedView()
{
    $("#includedContent").empty();
}

function showAddTestView() {
    $("#includedContent").load("add-test.html");

}

function showEditTestView(testObject) {
    $("#includedContent").load("edit-test.html",function(){
     loadTest(testObject);
    });
}

function showSuccessPopup (text)
{
document.getElementById( "AlertMsg").innerText= text;
document.getElementById( "AlertMsg").parentElement.style.display="inline-block";

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
        }
    };

    xhttp.open("GET", "https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/candidates", true);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getAccessToken());

    xhttp.send();
}
