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