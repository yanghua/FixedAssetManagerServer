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
    var paramIndex = src.indexOf("?")
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
    var newpwd = $("#input_pwd2").val();
    if (pwd.length === 0) {
        return false;
    }
    if (newpwd.length === 0) {
        return false;
    }
    var crypedPwd = CryptoJS.SHA256(pwd) + "";
    var crypedNewPwd = CryptoJS.SHA256(newpwd) + "";
    $.ajax({
        url     : "/modifypwd",
        type    : "POST",
        async   : false,
        cache   : false,
        data    : {
            "oldPwd"      : crypedPwd,
            "newPwd"      : crypedNewPwd,
        },
        success : function (statusCode) {
            if (statusCode) {
                if (statusCode === "1") {               //validated
                    bootbox.dialog({
                      message: "添加成功，请选择操作",
                      title: "成功提示",
                      buttons: {
                        success: {
                          label: "继续添加",
                          className: "btn-primary",
                          callback: function() {
                            $("#signinForm")[0].reset() 
                          }
                        },
                        danger: {
                          label: "返回首页",
                          className: "btn-primary",
                          callback: function() {
                            window.location="/";
                          }
                        }
                      }
                    });
                    //window.location="/";
                } else {
                    showTip(statusCode);
                }
            }

            return false;
        },
        error   : function (msg) {
            console.log(msg);
            showTip("3");
        }
    });

    return false;
    // $(".container .form-signin input").filter("[type*='password']").val(crypedPwd);
    // document.forms["signinForm"].submit();
}

/**
 * shwo login error tips
 * @param  {string} statusCode status code
 * @return {null}            
 */
function showTip (statusCode) {
    if (statusCode === "0") {
        $("#span_tipMsg").text("添加用户失败！");
    } else if (statusCode === "2") {
        $("#span_tipMsg").text("用户名已存在，请更换后重试！");
    } else if (statusCode === "3") {
        $("#span_tipMsg").text("服务器错误");
    } 

    $("#div_tip").fadeIn(1000);
    $("#div_tip").fadeOut(1000);
}
