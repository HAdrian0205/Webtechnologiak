<?php
    $jsonFile = '../json/vehicles.json';

    $carId = $_POST['carID'];
    $newImage = $_POST['image'];
    $newBrand = $_POST['brand'];
    $newModel = $_POST['model'];
    $newYear = $_POST['year'];
    $newMileage = $_POST['mileage'];
    $newFuel = $_POST['fuel'];
    $newPrice = $_POST['price'];

    $jsonContent = file_get_contents($jsonFile);

    $jsonData = json_decode($jsonContent, true);

    foreach ($jsonData as &$car) {
        if ($car['carID'] == $carId) {
            if($newImage != ''){ //TODO
                $imageURL = "../car_images/" . $car['image'];
                unlink($imageURL);
                $car['image'] = $newImage;
            }
            $car['brand'] = $newBrand;
            $car['model'] = $newModel;
            $car['year'] = $newYear;
            $car['mileage'] = $newMileage;
            $car['fuel'] = $newFuel;
            $car['price'] = $newPrice;
            break;
        }
    }

    file_put_contents($jsonFile, json_encode($jsonData, JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'data' => $jsonData]);
?>
