
function loginFormSubmit(){
    $('#fm_login').submit((e) => {
        
        e.preventDefault();
        let name  = $('#user').val();
        let password  = $('#password').val();
        if (!(name === "house-hunter-01" && password === "demo")){
            $('#fm_login').append('<p>Login failed </p>');
            return;
        }
        window.location.href = './dashboard.html';
    });
}
function closeLoginModal(){
    $('.btn_close').click( (e) =>{
        e.preventDefault();
        $('#fm_login').hide();
    })
}
function openLoginModal(){
    $('#linkLogIn').click( function(e) {
        e.preventDefault();
        $('#fm_login').show();
    });
}
$(function(){
    openLoginModal();
    closeLoginModal();
    loginFormSubmit();
})