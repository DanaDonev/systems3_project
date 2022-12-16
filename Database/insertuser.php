<?php
session_start();
include("db.php");


$fname = $_POST['fname'];
$sname = $_POST['sname'];
$email = $_POST['email'];
$psw = $_POST['psw'];

$sql = "SELECT id FROM users WHERE email = '$email'";
$check = mysqli_query($db, $sql);

if (!$check || mysqli_num_rows($check) == 1) {
    echo "User exists!";

} else {
    $insert = "INSERT INTO users (name, surname, email, password) VALUES ('$fname', '$sname', '$email', '$psw')";

    if (mysqli_query($db, $insert) === TRUE) {
        echo "Redirect to log in page";
    } else {
        echo "ERROR!";
    }
}
session_destroy();
?>