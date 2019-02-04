var changeDisplay = function (id, mode) {
    document.getElementById(id).style.display = mode;
}
var setView = function (isLogin) {
    if (isLogin) {
        changeDisplay('id01', 'none');
        changeDisplay('loginButton', 'none');
        changeDisplay('logoutButton', 'block');
    } else {
        changeDisplay('id01', 'none');
        changeDisplay('loginButton', 'block');
        changeDisplay('logoutButton', 'none');
    }
}

window.onload = function () {
    var modal = document.getElementById('id01');
    setView(false);
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    FB.Event.subscribe('auth.authResponseChange', auth_response_change_callback);
    FB.Event.subscribe('auth.statusChange', auth_status_change_callback);
    FB.Event.subscribe('auth.login', login_event);
    FB.Event.subscribe('auth.logout', logout_event);
    /*FB.api('/me','get',{fields:'id,name,birthday'},(res)=>{
        console.log('window.onload:' + JSON.stringify(res));
    });*/
}
var login_event = function (response) {
    console.log("login_event");
    console.log(response.status);
    console.log(response);
}

var logout_event = function (response) {
    console.log("logout_event");
    console.log(response.status);
    console.log(response);
}
var auth_status_change_callback = function (res) {
    console.log('auth_status_change_callback:');
}
var auth_response_change_callback = function (res) {
    console.log('auth_response_change_callback:');
}
var FBLoginClick = function () {
    setView(false);
    /*FB.api('/me',{fields:'id,name,birthday'},(res)=>{
        console.log('FBLoginClick:' + JSON.stringify(res));
    });*/
    /*FB.login((res)=>{
        console.log(res);
    },{scope:'id,name,birthday,email'});//{scope:'id,name,birthday,public_profile,email'}*/
    /*FB.getLoginStatus((response)=>{
        if(response.status === 'connected'){
            console.log('FBLoginClick:login!');
            xhttp = new XMLHttpRequest();
            var token = "";
            xhttp.onreadystatechange = function(){
                if(this.status==200 && this.readyState==4){
                    token = this.responseText;
                    //document.getElementById('text').innerHTML = this.responseText;
                }
            }
            xhttp.open('POST','/token',true);
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhttp.send('token='+response.authResponse.accessToken.toString());
            FB.api('/me',{fields:'id,name,birthday'},(res)=>{
                console.log('response:'+JSON.stringify(res));
            });
            setView(true);
        }else{
            console.log('FBLoginClick:not login');
        }
    });*/
}
var userID = "";
var LoginClick = function () {
    document.getElementById('id01').style.display = 'block';
    text = document.getElementById('text');
    FB.login((res)=>{
        console.log('LoginClick:FB.login');
        console.log(res);
    },{scope:'id,name,email'});
    FB.getLoginStatus((res) => {
        //console.log('LoginClick:'+res);
        if (res.status === 'connected') {
            text.innerHTML = JSON.stringify(res);
        }
        else {

        }
    });
    //console.log('userID:'+userID);
    //FB.api('/'+)
    //setView(false);
}
var LogoutClick = function () {
    FB.logout((response) => {
        console.log('LogoutClick:');
        console.log(response);
        setView(false);
    });
}