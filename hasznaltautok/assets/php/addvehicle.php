<?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);

        if ($data !== null) {
            $file_path = '../json/vehicles.json';

            if (file_exists($file_path)) {
                $existingData = json_decode(file_get_contents($file_path), true);
            } else {
                $existingData = [];
            }  

            $uniqueID = count($existingData);
            $data = ['carID' => $uniqueID+1] + $data;

            $existingData[] = $data;

            file_put_contents($file_path, json_encode($existingData, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    }
?>