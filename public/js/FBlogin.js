window.fbAsyncInit = function () {
    FB.init({
        appId: '528750284184452',
        xfbml: true,
        version: 'v2.11'
    });
    FB.AppEvents.logPageView();
    FB.getLoginStatus(function (response) {
        //console.log(response);
        if (response.status === 'connected') {
            //document.getElementsByClassName('fb-login-button')[0].style.display = 'none';
            //x.style.display = 'block';
            var accessToken = response.authResponse.accessToken;
            console.log('sdk init:login');
            //console.log(JSON.stringify(response));
            console.log(response);
            //FB.api('/'+response.authResponse.userID,{fields:'birthday'},(res)=>{
            /*FB.api('/me',{fields:'birthday'},(res)=>{                
                console.log(JSON.stringify(res));
            });*/
            setView(true);
        }
        else {
            console.log('sdk init:not login');
            //document.getElementsByClassName('fb-login-button')[0].style.display = 'block';
        }
    });
};