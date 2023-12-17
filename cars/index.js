var stop = false;

$(document).ready(function() {
    var stop = false;
    setTimeout(function() {
        if (!stop) {
            loadContent("assets/external_html/homepage.html");
            stop = true;
        }
    }, 0);

    const container = document.getElementById('contentContainer');
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