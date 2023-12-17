const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');


if(registerBtn != null && loginBtn != null) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

$(document).ready(function() {
    $("#menuContainer").on("click", "#homepage", function() {
        loadContent("assets/external_html/homepage.html");
    });

    $("#menuContainer").on("click", "#list", function() {
        loadContent("assets/external_html/list.html");
    });

    $("#menuContainer").on("click", "#contact", function() {
        loadContent("assets/external_html/contact.html");
    });
    
    function loadContent(url) {
        $.get(url, function(data) {
            $("#contentContainer").html(data);
        }).fail(function() {
            console.error("Hiba: Nem sikerült betölteni a tartalmat.");
        });
    }
});