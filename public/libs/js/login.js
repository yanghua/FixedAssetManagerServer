$(function () {
    /*
     *fixed bug: if the document is not ready, 
     *the request send by src will course session param lost
     */
    $("#captcha_div").append("<img src=\"/captchaImg\" class=\"captcha\" />");

    $(".container .form-signin #refreshBtn").click(function () {
        var jqObj = $(".container .form-signin .captcha");
        jqObj.prop("src",randomImgSrc(jqObj));
    });

    $(".container .form-signin .captcha").click(function () {
        var jqObj = $(".container .form-signin .captcha");
        jqObj.prop("src",randomImgSrc(jqObj));
    });

    $("#div_tip").hide();

});

/**
 * get a new url of img's src with a random time
 * @param  {object} jqObj the img's jquery object
 * @return {string}       the random src string
 */
function randomImgSrc (jqObj) {
    var src        = jqObj.attr("src");
    var paramIndex = src.indexOf("?");
    var hasParam   = paramIndex != -1;

    if (hasParam) {
        src = src.substring(0, paramIndex);
    }

    var newSrc = src + "?time=" + new Date().getTime();
    return newSrc;
}

/**
 * js submit form for login
 * @return {null} 
 */
function postAuthUserForm () {

    var pwd = $("#input_pwd").val();
    if (pwd.length === 0) {
        return false;
    }

    var crypedPwd = CryptoJS.SHA256(pwd)+"";

    $.ajax({
        url     : "/signin",
        type    : "POST",
        async   : false,
        cache   : false,
        data    : {
            "auth[userId]"      : $("#input_userId").val(),
            "auth[passwd]"      : crypedPwd,
            "auth[captchaCode]" : $("#input_captchaCode").val()
        },
        success : function (statusCode) {
            if (statusCode) {
                if (statusCode === "1") {               //validated
                    window.location="/";
                } else {
                    showTip(statusCode);
                }
            }

            return false;
        },
        error   : function () {
            showTip("3");
        }
    });

    return false;
}

/**
 * shwo login error tips
 * @param  {string} statusCode status code
 * @return {null}            
 */
function showTip (statusCode) {
    if (statusCode === "0") {
        $("#span_tipMsg").text("登陆失败");
    } else if (statusCode === "2") {
        $("#span_tipMsg").text("用户不存在");
    } else if (statusCode === "3") {
        $("#span_tipMsg").text("服务器错误");
    } else if (statusCode === "4") {
        $("#span_tipMsg").text("验证码错误");
    } else if (statusCode === "5") {
        $("#span_tipMsg").text("认证信息为空或存在非法字符");
    }

    $("#div_tip").fadeIn(1000);
    $("#div_tip").fadeOut(1000);
}
