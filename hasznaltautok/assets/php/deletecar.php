<?php
    $jsonFile = '../json/vehicles.json';
    $jsonData = file_get_contents($jsonFile);
    $cars = json_decode($jsonData, true);

    if (isset($_POST['carID'])) {
        $carIDToDelete = $_POST['carID'];

        foreach ($cars as $key => $car) {
            if ($car['carID'] == $carIDToDelete) {
                $imageURL = "../car_images/" . $car['image'];
                unlink($imageURL);
                unset($cars[$key]);
                break;
            }
        }

        $cars = array_values($cars);
        for ($i = 0; $i < count($cars); $i++) {
            $cars[$i]['carID'] = $i + 1;
        }

        $updatedData = json_encode(array_values($cars), JSON_PRETTY_PRINT);
        file_put_contents($jsonFile, $updatedData);

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request']);
    }
?>
