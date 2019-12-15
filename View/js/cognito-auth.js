(function scopeWrapper($) {
    var signinUrl = 'index.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    /*
     * Cognito User Pool functions
     */

    function register(email, name, password, onSuccess, onFailure) {
        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: email
        };

        var fullName = {
            Name: 'name',
            Value: name
        };

        var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(fullName);
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        attributeList.push(attributeEmail);
        attributeList.push(attributeName);


        userPool.signUp(email, password, attributeList, null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#registrationForm').submit(handleRegister);
    });

    function handleRegister(event) {
        var email = $('#userEmail').val();
        var userName = $('#userFullName').val();
        var password = $('#pass').val();
        var password2 = $('#passRepeat').val();

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'index.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, userName, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }
    
}(jQuery));
