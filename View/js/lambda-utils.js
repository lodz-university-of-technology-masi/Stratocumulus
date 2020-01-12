function callAwsLambda(verb, endpoint, func, body, async) {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            func(this.responseText);
        }
    };

    xhttp.open(verb, `https://ot28vqg79h.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`, async);

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', getRecruiterToken());

    xhttp.send(JSON.stringify(body));
}

function getRecruiterToken(){

    return sessionStorage.getItem('recruiterToken');

}

function getCandidateToken(){

    return sessionStorage.getItem('candidateToken');

}