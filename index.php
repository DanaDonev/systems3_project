<!DOCTYPE html>
<html>

<head>
    <style>
        @font-face {
            font-family: 'MyWebFont';
            src: url('./Frontend/Fonts/Comfortaa-VariableFont_wght.ttf');
        }

        body {
            font-family: 'Spectral', Georgia, Times, 'Times New Roman', serif;
            margin: 0px;
            background-size: cover;
            background-image: url('./Frontend/Images/welcome_dog.jpg');
            background-repeat: no-repeat;
        }

        div {
            width: 45%;
            margin-top: 3%;
            margin-left: 50%;
            font-family: 'MyWebFont';
            font-size: 5vw;
            color: black;
        }

        header {
            background-color: #CFC9C5;
            height: 10%;
            min-height: 50px;
            border: none;
            font-family: 'MyWebFont';
        }

        #img {
            width: 3%;
            min-width: 40px;
            margin-left: 10%;
        }

        #logotext {
            display: inline;
        }

        .button {
            font-size: large;
            background-color: transparent;
            border: solid 1px black;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <header>
        <a class="navbar-brand" href=""><img src="./Frontend/Images/logo.png" alt="" width="5%" id="img"></a>
        <h3 id="logotext">Petsitter</h3>
    </header>
    <div>Welcome home!
        <a href="./Pages/Signup.php" class="button">Sign Up</a>
    </div>
</body>

</html>