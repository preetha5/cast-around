
function signUpFailed(err){
    $("#signupResult").empty();
    let response = err.responseText;
    $("#signupResult").append(`
        <p>Account creation has failed.${response}</p>`
    );
}

function loginRedirect(){
    $("#signupResult").on("click", "#loginRedirect", (evt) =>{
        console.log("redirecting to login ..");
        evt.preventDefault();
        $("#signUpModal").modal('hide');
        $("#loginModal").modal('show');
    });
}

function signUpSucceeded(res){
    $("#signupResult").empty();
    $("#signupResult").append(
        `<p>Congrats! Account Created.<strong> 
        <a href="#" class="badge badge-success" id="loginRedirect">Ready to Login? </a>
         </p>`
    );
}

function signUpFormSubmit(){
    $("#fm_signup").submit((e) => {
        e.preventDefault();
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let newUser = $('#newUser').val();
        let newPass = $('#newPass').val();
        if (newPass.length <8){
            $("#signupResult").empty();
            $("#signupResult").append(`
            <p style="color:maroon">Sign Up Failed:Passwords must be atleast 8 characters long.</p>`
            );
        return;
        }
        const signUpObj = {
            firstName,
            lastName,
            username: newUser,
            password: newPass
        };
        console.log(signUpObj);
        //Make an ajax post request with new user details to register
        $.ajax({
            type: 'POST',
            url: '/signup',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(signUpObj),
            processData: false,
            success:signUpSucceeded,
            error: signUpFailed
          });
          
    });
};

function loginFailed(err){
    $("#loginResult").empty();
    console.log(err);
    $("#loginResult").append(`
        <p>Login Failure. Incorrect username or password.${err.responseText}</p>`
    );
}

//On successful login, store the JWT in local storage
//Redirect the user to Search page
function loginSucceeded(response){
    console.log(response);
    sessionStorage.setItem("authToken", response.authToken);
    sessionStorage.setItem("user", response.username);
    window.location.href = './search.html';
}

function loginFormSubmit(){
    $('#fm_login').submit((e) => {
        
        e.preventDefault();
        let email  = $('#email').val();
        let password  = $('#password').val();

        const loginObj = {
            username:email,
            password: password
        };
        console.log(loginObj);
        //Make an ajax post request with new user details to register
        $.ajax({
            type: 'POST',
            url: '/login',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(loginObj),
            processData: false,
            success: loginSucceeded,
            error: loginFailed
          });


        // if (!(name === "house-hunter-01" && password === "demo")){
        //     $('#fm_login').append('<p>Login failed </p>');
        //     return;
        // }
        //window.location.href = './dashboard.html';
    });
}
function closeLoginModal(){
    $('.fm_close').click( (e) =>{
        e.preventDefault();
        $('form').hide();
    })
}
function openLoginModal(){
    $('#linkLogIn').click( function(e) {
        e.preventDefault();
        $('#fm_login').show();
    });
}

function openSignUpModal(){
    $('#linkSignUp').click( function(e) {
        e.preventDefault();
        $('#fm_signUp').show();
    });
}

$(function(){
    //openLoginModal();
    //closeLoginModal();
    loginFormSubmit();
    //openSignUpModal();
    signUpFormSubmit();
    loginRedirect();
})