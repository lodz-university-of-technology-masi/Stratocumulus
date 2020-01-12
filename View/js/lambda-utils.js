function callAwsLambda(verb, endpoint, func, body, async) {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            func(this.responseText);
        }
    };

    xhttp.open(verb, `https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`, async);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getAuthToken(getCognitoUser()));

    xhttp.send(JSON.stringify(body));
}

function getCognitoUser() {
    var poolData = {
        UserPoolId: 'us-east-1_CY4O3GKHV',
        ClientId: 'thcc01b1nkqm7fti3p434r7un'
    };
    var poolData2 = {
        UserPoolId: 'us-east-1_lWqCuNtQd',   //_config.cognito.recruiterPoolId,
        ClientId: '4rv0ibelu8sc3hi2dmjo05g5ku',  //_config.cognito.recruiterPoolClientId,
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData2);

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