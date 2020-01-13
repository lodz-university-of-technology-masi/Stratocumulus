const userRoles = {
    CANDIDATE: 'candidate',
    RECRUITER: 'recruiter'
};

function callRecruiterAwsLambda(verb, endpoint, func, body, async, role) {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            func(this.responseText);
        }
    };

    xhttp.open(verb, `https://4lduoan74b.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`, async);

    let token = role === userRoles.CANDIDATE ? getCandidateToken() : getRecruiterToken();

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', token);

    xhttp.send(JSON.stringify(body));
}

function callCandidateAwsLambda(verb, endpoint, func, body, async, role) {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            func(this.responseText);
        }
    };

    let token = role === userRoles.CANDIDATE ? getCandidateToken() : getRecruiterToken();

    xhttp.open(verb, `https://sv8dll1cp6.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`, async);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', token);

    xhttp.send(JSON.stringify(body));
}

function getRecruiterToken() {

    return sessionStorage.getItem('recruiterToken');

}

function getCandidateToken(){

    return sessionStorage.getItem('candidateToken');

}