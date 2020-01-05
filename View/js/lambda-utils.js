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

function getAccessToken() {
    let email = 'adrianwarcholinski9@gmail.com';
    let password = 'Qwerty123';

    let cognitoUser = getCognitoUser(email);

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function printOkMessage() {
            console.log('Authenticated successfully')
        },
        onFailure: function printFailedMessage() {
            console.log('Authentication failed')
        }
    });

    let token;

    cognitoUser.getSession(function (err, session) {
        if (!err) {
            token = session.getIdToken().getJwtToken();
        }
    });

    return token;
}

function getCognitoUser(email) {
    let poolData = {
        UserPoolId: 'us-east-1_CY4O3GKHV',
        ClientId: 'thcc01b1nkqm7fti3p434r7un'
    };

    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
}