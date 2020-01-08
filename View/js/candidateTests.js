var closebtns = document.getElementsByClassName("close");
var i;

/* Loop through the elements, and hide the parent, when clicked on */
for (i = 0; i < closebtns.length; i++) {
    closebtns[i].addEventListener("click", function() {
        this.parentElement.style.display = 'none';
    });}

function openPage(pageUrl){
    window.open(pageUrl);
}

function change_page(){
    // similar behavior as an HTTP redirect
    window.location.replace("solveTest.html");
    //or
    // similar behavior as clicking on a link
    // window.location.href = "test.html";
};

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
    xhttp.setRequestHeader('Authorization', getAuthToken(cognitoUser));

    xhttp.send();

    return idToReturn;

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