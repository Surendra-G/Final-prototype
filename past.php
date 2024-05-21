<?php

$servername = "localhost";
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$dbname = "weather_surendragiri"; // Your database name

// Create a database connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$cityParam = $_GET['city'];

// Loop through the past 6 days (excluding today) and display available data or "N/A"
$currentDate = strtotime(date('Y-m-d'));
for ($i = 1; $i <= 6; $i++) {
    $targetDate = date('Y-m-d', strtotime("-$i days", $currentDate));

    // Query the database for weather data for the specified city and date
    $sql = "SELECT * FROM weather_data_surendragiri WHERE city = ? AND DATE(date) = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $cityParam, $targetDate);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    echo "<div class='past-weather-box'>
        <div class='past-weather-content'>
            <h2>Past Weather Data for: <br/> $cityParam on <br>" . date('Y-m-d', strtotime($targetDate)) . "</h2>";

    if ($data) {
        echo "<p>Temperature: {$data['temperature']} °C</p>
            <p>Humidity: {$data['humidity']}%</p>
            <p>Pressure: {$data['pressure']} Pa</p>
            <p>Wind Speed: {$data['wind']} m/s</p>
            <p>Description: {$data['description']}</p>";
    } else {
        echo "<p>Temperature: N/A</p>
            <p>Humidity: N/A</p>
            <p>Pressure: N/A</p>
            <p>Wind Speed: N/A</p>
            <p>Description: N/A</p>";
    }

    echo "</div>
    </div>";
    
    // Close the prepared statement
    $stmt->close();
}

// Close the database connection
$conn->close();
?>
