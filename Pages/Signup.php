<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            margin: 0px;
        }

        div {
            width: 40%;
            margin-left: 30%;
        }

        input[type=text],
        input[type=password] {
            width: 100%;
            padding: 15px;
            margin: 5px 0 22px 0;
            display: inline-block;
            border: none;
            background: #f1f1f1;
        }

        button {
            width: 160px;
            height: 40px;
            font-size: large;
            background-color: white;
            border: solid 1px black;
            cursor: pointer;
        }

        header {
            background-color: lightgray;
            height: 10%;
            min-height: 50px;
            border: none;
            font: 'Spectral';
        }

        #img {
            width: 3%;
            min-width: 40px;
            margin-left: 10%;
        }

        #logotext {
            display: inline;
        }
    </style>
</head>

<body>
    <header>
        <a class="navbar-brand" href=""><img src="./Frontend/Images/logo.png" alt="" width="5%" id="img"></a>
        <h3 id="logotext">Petsitter</h3>
    </header>
    <div id="" class="center">
        <form class="modal-content" action="insertuser.php" method="post">
            <h1>Sign Up</h1>
            <p>Please fill in this form to create an account.</p>
            <hr>

            <label for="fname"><b>First Name</b></label>
            <input type="text" name="fname" required>

            <label for="sname"><b>Surname</b></label>
            <input type="text" name="sname" required>

            <label for="email"><b>Email</b></label>
            <input type="text" name="email" required>

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="" name="psw" required>

            <label for="psw-repeat"><b>Repeat Password</b></label>
            <input type="password" placeholder="" name="psw-repeat" required>
            <!-- 
                <label>
                    <input type="checkbox" checked="checked" name="remember" style="margin-bottom:15px"> Remember me
                </label> 
            -->


            <button type="submit">Sign Up</button>
            <!-- <p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p> !-->

            <!-- <div class="clearfix">
                    <button type="button" onclick="document.getElementById('id01').style.display='none'"
                        class="cancelbtn">Cancel</button>
                    <button type="submit" class="signupbtn">Sign Up</button>
                </div> -->

        </form>
    </div>
</body>

</html>