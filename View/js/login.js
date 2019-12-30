function change_page(){
    // similar behavior as an HTTP redirect
    window.location.replace("candidateTests.html");
    //or
    // similar behavior as clicking on a link
    // window.location.href = "test.html";
};



var UserAPP = window.UserAPP || {};

(function scopeWrapper($) {


    var poolData = {
        //UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        //ClientId : _config.cognito.clientId, // Your client id here
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId,
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);



    UserAPP.login = function () {
        var username = $('#username').val();
        var authenticationData = {
            Username: username,
            Password: $('#password').val()
        };

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function () {
                //window.location = '/Secret.html';
               // window.location.href = 'MainView.html';
                window.location.replace("candidateTests.html");
            },
            onFailure: function (err) {
                alert(err);
            }
        });
    };




}(jQuery));
