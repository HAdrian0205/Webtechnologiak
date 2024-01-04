<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["fileToUpload"])) {
    $targetDirectory = "assets/car_images/";
    $targetFile = $targetDirectory . basename($_FILES["fileToUpload"]["name"]);

    $fileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile);
}
?>