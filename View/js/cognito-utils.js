function getAccessToken() {
    var email = 'adrianwarcholinski9@gmail.com';
    var password = 'Qwerty123';

    var cognitoUser = getCognitoUser(email);

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function () {
        }
        ,
        onFailure: function () {
        }
    });

    var token;

    cognitoUser.getSession(function (err, session) {
        if (!err) {
            token = session.getIdToken().getJwtToken();
        }
    });

    console.log(`Token: ${token}`);

    return token;
}

function getCognitoUser(email) {
    var poolData = {
        UserPoolId: 'us-east-1_CY4O3GKHV',
        ClientId: 'thcc01b1nkqm7fti3p434r7un'
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    return new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });
}