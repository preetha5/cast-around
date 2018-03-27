//Global vars
let loggedIn = false;

//Update the login/out button depending of if the 
//user authtoken exists
function setLoginLogoutLink(){
    if( sessionStorage.getItem("authToken") !== null) {
        $('.logInListItem').empty().append(
            `
            <a class="nav-link" href="#" id="linkLogout">Log Out</a>
            `
        );
    }
}

//If user clicks on logout, destroy the local JWT and redirect to Landing page
function logOutListener(){
    $('#linkLogout').click(function(e){
        e.preventDefault();
        localStorage.removeItem("home");
        sessionStorage.removeItem("authToken");
        window.location.href = "./index.html"
    })
}

//If unauthenticated user closes the Login modal
//before logging in, redirect them back to index page.
function loginModalCloseListener(){
    $("#loginModal").on('hidden.bs.modal',(e) =>{
        e.preventDefault();
        window.location.href = "./index.html";
    })
}

function signUpFailed(err){
    $("#signupResult").empty();
    let response = err.responseText;
    $("#signupResult").append(`
        <p>Account creation has failed.${response}</p>`
    );
}

//After signup successful, hide sign up and show login window
function loginRedirect(){
    $("#signupResult").on("click", "#loginRedirect", (evt) =>{
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

//Get the sign up details and call the server auth API to create account
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

//On login failure show the error
function loginFailed(err){
    $("#loginResult").empty();
    $("#loginResult").append(`
        <p>Login Failure. Incorrect username or password.${err.responseText}</p>`
    );
}

//On successful login, store the JWT in local storage
//Redirect the user to Search page
function loginSucceeded(response){
    loggedIn = true;
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
        $('#fm_login').attr("aria-hidden","false");
    });
}

function openSignUpModal(){
    $('#linkSignUp').click( function(e) {
        e.preventDefault();
        $('#fm_signUp').show();
        $('#fm_signUp').attr("aria-hidden","false");
    });
}

$(function(){
    setLoginLogoutLink();
    logOutListener();
    loginFormSubmit();
    signUpFormSubmit();
    loginRedirect();
    loginModalCloseListener();
})