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

function logOut() {

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