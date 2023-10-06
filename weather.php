<?php
$servername = "localhost";
$username = "root"; //  MySQL username
$password = ""; //  MySQL password
$dbname = "weather_surendragiri"; //  new database name

// Read and decode JSON data
$data = json_decode(file_get_contents("php://input"));

if ($data === null) {
    echo "Error: Invalid JSON data";
    exit;
}

// Create a database connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Sanitize user input
$city = isset($data->city) ? $conn->real_escape_string($data->city) : '';
$temperature = isset($data->data->main->temp) ? $data->data->main->temp : null;
$humidity = isset($data->data->main->humidity) ? $data->data->main->humidity : null;
$pressure = isset($data->data->main->pressure) ? $data->data->main->pressure : null;
$wind = isset($data->data->wind->speed) ? $data->data->wind->speed : null;
$description = isset($data->data->weather[0]->description) ? $data->data->weather[0]->description : '';

if ($city === '') {
    echo "Error: City data not provided";
    exit;
}

// Check if data for the same city exists on the current date
$sql = "SELECT * FROM weather_data_surendragiri WHERE city = '$city' AND DATE(date) = CURDATE()";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Data for the same city exists on the current date
    echo "Data for the same city already exists today";
} else {
    // Insert the data into the database
    $insertSql = "INSERT INTO weather_data_surendragiri (city, date, temperature, humidity, pressure, wind, description)
                  VALUES ('$city', NOW(), '$temperature', '$humidity', '$pressure', '$wind', '$description')";

    if ($conn->query($insertSql) === TRUE) {
        echo "Data saved successfully";
    } else {
        echo "Error: Unable to save data";
    }
}

// Close the database connection
$conn->close();
?>
