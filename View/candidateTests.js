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