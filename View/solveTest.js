document.getElementById("form1").onsubmit=function() {
     variable = parseInt(document.querySelector('input[name = "variable"]:checked').value);
   sub = parseInt(document.querySelector('input[name = "sub"]:checked').value);
   con = parseInt(document.querySelector('input[name = "con"]:checked').value);
   ifstate = parseInt(document.querySelector('input[name = "ifstate"]:checked').value);


   result = variable + sub + con + ifstate;

document.getElementById("grade").innerHTML = result;



return false; 
}

function change_page(){
    // similar behavior as an HTTP redirect
    window.location.replace("candidateTests.html");
    //or
    // similar behavior as clicking on a link
    // window.location.href = "test.html";
};