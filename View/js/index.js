function signInButton() {

    var authenticationData = {
        Username : document.getElementById("inputUsername").value,
        Password : document.getElementById("inputPassword").value,
    };

    //var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId : 'us-east-1_CY4O3GKHV',    //_config.cognito.userPoolId, // Your user pool id here
        ClientId : 'thcc01b1nkqm7fti3p434r7un',    //_config.cognito.userPoolClientId, // Your client id here
    };

    var poolData2 = {
        UserPoolId: 'us-east-1_lWqCuNtQd',   //_config.cognito.recruiterPoolId,
        ClientId: '4rv0ibelu8sc3hi2dmjo05g5ku',  //_config.cognito.recruiterPoolClientId,
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var recruiterPool = new AmazonCognitoIdentity.CognitoUserPool(poolData2);

    var userData = {
        Username : document.getElementById("inputUsername").value,
        Pool : userPool,
    };
    var recruiterData = {
        Username : document.getElementById("inputUsername").value,
        Pool: recruiterPool,
    };

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    var cognitoRecruiter = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(recruiterData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var token = result.getAccessToken().getJwtToken()
            console.log('access token + ' + token);
            sessionStorage.clear();
            sessionStorage.setItem('candidateToken', token);
            window.location.replace("candidateTests.html");
        },

        onFailure: function(err) {
            // alert(err);
            // alert('Bledny login lub haslo!');
            // console.log('access token + ' + result.getAccessToken().getJwtToken());
            // window.location.href = 'MainView.html';

            cognitoRecruiter.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    var token = result.getAccessToken().getJwtToken()
                    console.log('access token + ' + result);
                    sessionStorage.clear();
                    sessionStorage.setItem('recruiterToken', token);
                    window.location.replace("MainView.html");
                },

                onFailure: function(err) {
                    // alert(err);
                    // console.log('access token + ' + result.getAccessToken().getJwtToken());
                    // window.location.href = 'MainView.html';
                    alert('Bledny login lub haslo!');



                },

            });

        },

    });
}