$(function () {
    $(".container .form-signin #refreshBtn").click(function () {
        $(".container .form-signin .captcha").attr("src","/captchaImg");
    });

    $(".container .form-signin .captcha").click(function () {
        $(".container .form-signin .captcha").attr("src","/captchaImg");
    });
});