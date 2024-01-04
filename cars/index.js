var pageNumber;
var homeButton = document.getElementById("homepage");
var listButton = document.getElementById("list");
var contactButton = document.getElementById("contact");
var currentIndex = 0;
var data;
var count = 0;

document.addEventListener("DOMContentLoaded", function() {
    pageNumber = 1;
    loadContent();
    homeButton.disabled = true;

    if ('caches' in window) {
        caches.open('image-cache').then(function(cache) {
          var imageUrl1 = 'assets/images/bmw1.webp';
          var imageUrl2 = 'assets/images/bmw2.webp';
          var imageUrl3 = 'assets/images/audi1.webp';
          
          fetch(new Request(imageUrl1)).then(function(response) {
            cache.put(new Request(imageUrl1), response);
          });
          fetch(new Request(imageUrl2)).then(function(response) {
            cache.put(new Request(imageUrl2), response);
          });
          fetch(new Request(imageUrl3)).then(function(response) {
            cache.put(new Request(imageUrl3), response);
          });
        });
    }

    if(document.getElementById("car-img") !== null) {
        document.getElementById("car-img").addEventListener("click", function() {
            openLightbox();
        });
    }
});

$(document).ready(function() {
    //Panel váltása
    const container = document.getElementById('contentContainer');

    $("#addCar").on("click", function() {
        container.classList.add("active");
    });

    $("#carList").on("click", function() {
        container.classList.remove("active");
    });

    //Menü kezelése
    $("#menuContainer").on("click", "#homepage", function() {
        if(pageNumber != 1) {
            $('#contentContainer').fadeOut('300', function(){
                $("#contentContainer").load("assets/external_html/homepage.html", function(){
                    $('#contentContainer').fadeIn('300');
                });
            });
            pageNumber = 1;
            console.log(pageNumber);
        }
    });

    $("#menuContainer").on("click", "#list", function() {
        if(pageNumber != 2) {
            $('#contentContainer').fadeOut('300', function(){
                $("#contentContainer").load("assets/external_html/list.html", function(){
                    $('#contentContainer').fadeIn('300');
                    loadAndShowCar();
                });
            });
            pageNumber = 2;
            console.log(pageNumber);
        }
    });

    $("#menuContainer").on("click", "#contact", function() {
        if(pageNumber != 3) {
            $('#contentContainer').fadeOut('300', function(){
                $("#contentContainer").load("assets/external_html/contact.html", function(){
                    $('#contentContainer').fadeIn('300');
                });
            });
            pageNumber = 3;
            console.log(pageNumber);
        }
    });

    $("#menuContainer").on("click", "button", function(){
        switch(pageNumber) {
            case 1: 
                homeButton.disabled = true;
                listButton.disabled = false;
                contactButton.disabled = false;
                break;
            case 2:
                listButton.disabled = true;
                homeButton.disabled = false;
                contactButton.disabled = false;
                break;
            case 3:
                contactButton.disabled = true;
                homeButton.disabled = false;
                listButton.disabled = false;
                break;
        }
    });

    //Autó hozzáadása
    $("#addCarBtn").on("click", function() {
        sendDataToServer();
        loadAndShowCar();
        //checkButtonStates();
    });
    
    //Az autók listájának megjelenítése
    $("#previous").on("click", function() {
        changeCar(-1);
        console.log("prev");
    });

    $("#next").on("click", function() {
        changeCar(1);
        console.log("next");
    });

    //Módosítás
    $("#modify").on("click", function() {
        modifyCar(data[currentIndex]);
    });

    $("#modifyButton").on("click", function() {
        var fileVar = document.getElementById("cimage");
        var fileName;

        if(fileVar.value != ''){
            console.log(fileVar.value);
            fileName = fileVar.files[0].name;
        } else {
            fileName = '';   
        }

        var carData = {
            carID: data[currentIndex].carID,
            image: fileName,
            brand: $('#cbrand').val(),
            model: $('#cmodel').val(),
            year: $('#cyear').val(),
            mileage: $('#cmileage').val(),
            fuel: $('#cfuel').val(),
            price: $('#cprice').val()
        };

        forceCacheClear("assets/external_html/list.html");
        $.ajax({
            url: 'assets/php/modifyvehicle.php',
            type: 'POST',
            data: carData,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    uploadFile("cimage");
                    console.log('A módosítás sikeresen végrehajtva.');
                    alert("Sikeres módosítás!");
                    cancelModify(data[currentIndex]);
                } else {
                    console.log('Hiba a módosítás során.');
                }
            },
            error: function () {
                console.log('Hiba az AJAX kérés során.');
            }
        });
    });

    $("#cancel").on("click", function() {
        cancelModify(data[currentIndex]);
    });

    //Törlés
    $("#delete").on("click", function() {
        deleteCar(data[currentIndex].carID);
        count-1;
    });
});

//Homepage betöltése
function loadContent() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                document.getElementById("contentContainer").innerHTML = xhr.responseText;
            } else {
                console.error("Hiba a tartalom betöltésekor: " + xhr.status);
            }
        }
    };

    xhr.open("GET", "assets/external_html/homepage.html", true);
    xhr.send();
}

//Hozzáadás funkciók
function sendDataToServer() {
    var fileVar = document.getElementById("fileInput");
    if(fileVar.value != ''){
        var fileName = fileVar.files[0].name;
    } else {
        alert("Kép megadása kötelező!");
        return 0;
    }

    var brandVar = document.getElementById("brand").value;
    var modelVar = document.getElementById("model").value;
    var yearVar = document.getElementById("year").value;
    var mileageVar = document.getElementById("mileage").value;
    var fuelVar = document.getElementById("fuel").value;
    var priceVar = document.getElementById("price").value;

    if(brandVar == '' || modelVar == '' || yearVar == '' || mileageVar == '' || fuelVar == '' || priceVar == '') {
        alert("Minden adatot kötelező megadni!");
        return 0;
    } else if (!Number.isInteger(parseInt(yearVar))) {
        alert("Az évszám csak egész számot tartalmazhat!");
        return 0;
    } else if (!Number.isInteger(parseInt(mileageVar))) {
        alert("Az kilométeróra állás csak egész számot tartalmazhat!");
        return 0;
    } else if (!Number.isInteger(parseInt(priceVar))) {
        alert("Az autó ára csak egész számot tartalmazhat!");
        return 0;
    }
    
    uploadFile("fileInput");

    var carData = {
        image: fileName,
        brand: brandVar,
        model: modelVar,
        year: yearVar,
        mileage: mileageVar,
        fuel: fuelVar,
        price: priceVar 
    };

    var xhr = new XMLHttpRequest();
    var url = 'assets/php/addvehicle.php';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);

        if (response.success) {
            console.log('JSON fájl sikeresen írva.');
        } else {
            console.error('Hiba történt: ' + response.error);
        }
    };

    xhr.onerror = function() {
        console.error('AJAX kérés sikertelen.');
    };

    xhr.send(JSON.stringify(carData));

    clearInputFields();

    alert("Autó sikeresen hozzáadva!");
}

function clearInputFields() {
    document.getElementById("fileInput").value = '';
    document.getElementById("brand").value = '';
    document.getElementById("model").value = '';
    document.getElementById("year").value = '';
    document.getElementById("mileage").value = '';
    document.getElementById("fuel").value = '';
    document.getElementById("price").value = '';
}

//Lista funkciók
function loadAndShowCar() {
    var jsonFile = 'assets/json/vehicles.json';

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('A hálózati kérés sikertelen: ' + response.status);
            }
            return response.json();
        })
        .then(jsonData => {
            data = jsonData;
            count = Object.keys(data).length;
            if(count > 0) {
                showCar(data[currentIndex]);
            } else {
                emptySet();
            }
        })
        .catch(error => {
            console.error('Hiba történt:', error);
        });
    
    //checkButtonStates();
}
  
function showCar(car) {
    var carListData = document.getElementById('actual-car');
    carListData.innerHTML = `
        <h2>${car.brand} ${car.model}</h2>
        <img id="car-img" onclick="openLightbox()" src="assets/car_images/${car.image}">
        <p>Évjárat: ${car.year}</p>
        <p>Kilométeróra: ${car.mileage} km</p>
        <p>Üzemanyag: ${car.fuel}</p>
        <p>Ár: ${car.price} Ft</p>
    `;
}

function changeCar(direction) {

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex >= count) {
        currentIndex = count - 1;
    }

    loadAndShowCar();
}

//Módosítás funkciók
function modifyCar(car) { //TODO
    var carListData = document.getElementById('actual-car');
    carListData.innerHTML = `
        <form id="modify-form">
            <input type="file" id="cimage">
            <input type="text" id="cbrand" name="cbrand" value=${car.brand}>
            <input type="text" id="cmodel" name="cmodel" value=${car.model}>
            <input type="text" id="cyear" name="cyear" value=${car.year}>
            <input type="text" id="cmileage" name="cmileage" value=${car.mileage}>
            <input type="text" id="cfuel" name="cfuel" value=${car.fuel}>
            <input type="text" id="cprice" name="cprice" value=${car.price}>
        </form>
    `;

    var listTitle = document.getElementById("list-title");
    var listDesc = document.getElementById("list-desc");

    listTitle.innerHTML = `
        Módosítás
    `;

    listDesc.innerHTML = `
        Módosítsa a jármű adatait szabadon!
    `;

    $(".diffBtn1").toggle();
    $(".diffBtn2").toggle();
    $("i.fa.fa-trash").toggle();
}

function cancelModify() {
    if(count > 0) {
        console.log(count);
        loadAndShowCar();
    } else {
        console.log(count);
        emptySet();
    }

    var listTitle = document.getElementById("list-title");
    var listDesc = document.getElementById("list-desc");

    listTitle.innerHTML = `
        Autólista
    `;

    listDesc.innerHTML = `
        A rendszerbe bejegyzett járművek listája!
    `;

    $(".diffBtn1").toggle();
    $(".diffBtn2").toggle();
    $("i.fa.fa-trash").toggle();
}

//Törlés
function deleteCar(carID) {
    var confirmDelete = confirm('Biztosan törölni szeretné ezt az autót?');

    if (confirmDelete) {
        $.ajax({
            url: 'assets/php/deletecar.php',
            type: 'POST',
            data: { carID: carID },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    console.log('Autó sikeresen törölve.');
                    alert("Az autó törlésre került a rendszerből!");
                    currentIndex = 0;
                    cancelModify();
                    forceCacheClear('assets/external_html/list.html');
                } else {
                    console.error('Hiba az autó törlése során.');
                }
            },
            error: function () {
                console.error('Hiba az AJAX kérés során.');
            }
        });
    } else {
        console.log('Az autó nem került törlésre.');
    }
}

//Egyéb funkciók
function checkButtonStates() {
    var previousButton = document.getElementById("previous");
    var nextButton = document.getElementById("next");

    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === count - 1;
}

function forceCacheClear(url) {
    fetch(url, { cache: 'no-store' })
        .then(response => {
            console.log('Cache cleared for: ' + url);
        })
        .catch(error => {
            console.error('Error clearing cache: ' + error);
        });
}

function emptySet() {
    var actualCar = document.getElementById("actual-car");

    actualCar.innerHTML = `
        Még nem szerepel jármű a listában!
    `;
}

function uploadFile(fileUrl) {
    var fileInput = document.getElementById(fileUrl);
    console.log(fileInput);
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append("fileToUpload", file);

    var xhr = new XMLHttpRequest();
    var url = 'upload.php'; 
    xhr.open("POST", url, true);

    xhr.send(formData);
}

function openLightbox() {
    document.getElementById('lightbox').style.display = 'block';
    var lightbox = document.getElementById("lightbox");

    lightbox.innerHTML = `
        <img src="assets/car_images/${data[currentIndex].image}">
        <span class="close" id="close" onclick="closeLightbox()">&times;</span>
    `;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}