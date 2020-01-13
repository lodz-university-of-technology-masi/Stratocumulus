var TestApp = window.TestApp || {};

(function scopeWrapper($) {
    var signinUrl = 'index.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
        _config.cognito.userPoolClientId &&
        _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    TestApp.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    TestApp.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    /*
     * Cognito User Pool functions
     */

    function register(email, name, password, onSuccess, onFailure) {

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

        userPool.signUp(email, password, [attributeName, attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function update(name, oldpass, password, onSuccess, onFailure) {

        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    alert(err);
                    return;
                }
                console.log('session validity: ' + session.isValid());
            });
        }

        var fullName = {
            Name: 'name',
            Value: name
        };

        var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(fullName);

        cognitoUser.updateAttributes([attributeName], function(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
            console.log('call result: ' + result);
        });

        cognitoUser.changePassword(oldpass, password , function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
        });

    }

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#registrationForm').submit(handleRegister);
        $('#editForm').submit(handleEdition);
        $('#signinForm').submit(handleSignin);
        $('#verifyForm').submit(handleVerify);

    });
    
    function sendRequestToDB(id) {

        var toSend =
            {
                "assignedTests": [],
                "candidateId": id
            };

        alert("exit: " + toSend);

        callRecruiterAwsLambda("POST", `candidatetests`, afterPostEmptyCandidate, JSON.stringify(toSend), true, userRoles.RECRUITER);
}

    function afterPostEmptyCandidate(response) {
        console.log(response);
    }
    
    function getIdOfNewUser(desiredEmail) {
        callRecruiterAwsLambda("GET", `candidate?email=${desiredEmail}`, afterGetNewUserId, '', true, userRoles.CANDIDATE);
    }

    function afterGetNewUserId(response) {
        alert("res: " + JSON.parse(response))
        var parsed = JSON.parse(response);
        var id = parsed.id;
        sendRequestToDB(id);
    }

    function handleSignin(event) {
        var email = $('#emailInputSignin').val();
        var password = $('#passwordInputSignin').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                console.log('Successfully Logged In');
                window.location.href = 'MainView.html';
            },
            function signinError(err) {
                alert(err);
            }
        );
    }

    function handleRegister(event) {
        var email = $('#userEmail').val();
        var userName = $('#userFullName').val();
        var password = $('#pass').val();
        var password2 = $('#passRepeat').val();

        var onSuccess = function registerSuccess(result) {
            alert('Konto zostało poprawnie utworzone!\nSprawdź swoją skrzynkę pocztową!');
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            getIdOfNewUser(email);
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
            //window.location.href = 'MainView.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, userName, password, onSuccess, onFailure);
        } else {
            alert('Podane hasła nie są takie same!');
        }
    }

    function handleEdition(event) {
        var userName = $('#userEditedFullName').val();
        var oldpassword = $('#oldPass').val();
        var password = $('#editedPass').val();
        var password2 = $('#editedPassRepeat').val();

        var onSuccess = function updateSuccess(result) {
            alert('Konto zostało zaktualizowane!');
            var confirmation = ('Aktualizacja zakończona pomyślnie.');
            if (confirmation) {
                window.location.href = 'candidateTests.html';
            }
        };

        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            update(userName, oldpassword, password, onSuccess, onFailure);
        } else {
            alert('Podane hasła nie są takie same!');
        }
    }

    function handleVerify(event) {
        var email = $('#emailInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                console.log('call result: ' + result);
                console.log('Successfully verified');
                alert('Verification successful. You will now be redirected to the login page.');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }


}(jQuery));
