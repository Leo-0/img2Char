var cns = $('#canvas')[0];
var ctx = cns.getContext('2d');
var font = getFont();
ctx.font = font;
var maxCharSize = ctx.measureText("&").width;
var cnsd = $('#imgdata')[0];
var ctxd = cnsd.getContext('2d');
var text = ['#', '&', '@', '%', '$', 'w', '*', '+', 'o', '?', '!', ';', '^', ',', '.', ''];
var img = new Image();
var golden_ratio = (Math.sqrt(5) - 1) / 2;//0.618
var width = window.screen.availWidth - 30;
var height = width * golden_ratio;//window.screen.availHeight - 150;
cns.width = width;
cns.height = height;
img.onload = function () { time = getTimeInterval(); initAndDrawText(time); };
var color = getColor();
var colorit = getColorIt();
function getColorIt() {
    var reg = /colorit=([01])/;
    var res = decodeURIComponent(window.location.href).match(reg);
    return res ? parseInt(res[1]) : 0;
}
function getColor() {
    var reg = /color=([a-zA-Z]+)|[\"|\']((#[\da-fA-F]{6})|(rgb\([\d]{1,3},[\d]{1,3},[\d]{1,3}\))|[a-zA-Z]+)[\"|\']/;
    var res = decodeURIComponent(window.location.href).match(reg);
    return res ? typeof res[1] !== "undefined" ? res[1] : res[2] : "";
}
function getFont() {
    var reg = /font=[\"|\']([\d]+(\.[\d]+)?px [\S]+)[\"|\']/;
    var res = decodeURIComponent(window.location.href).match(reg);
    return res ? res[1] : "10px sans-serif";
}
function getTimeInterval() {
    var reg = /time=[\d]+/;
    var res = decodeURIComponent(window.location.href).match(reg);
    return res ? parseInt(res[1]) : 0;
}

function img2Text(g) {
    var len = text.length;
    // var i = g % len === 0 && g !== 0 ? parseInt(g / len) - 1 : parseInt(g / len);
    var i = parseInt(g / len);
    if (i >= len) {
        return img2Text(i);
    }
    return text[i];
}

function getGray(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
    // return Math.pow((Math.pow(r, 2.2) + Math.pow(1.5 * g, 2.2) + Math.pow(0.6 * b, 2.2)) / (1 + Math.pow(1.5, 2.2) + Math.pow(0.6, 2.2)), 1 / 2.2)
}

function initAndDrawText(time = 0) {
    $('#btn').text('选择图片');
    var rem = img.width / img.height;
    var cw = img.width > width ? width : img.width;
    cns.width = cw < 500 ? 500 : cw;
    cns.height = cns.width / rem;
    cnsd.width = cns.width;
    cnsd.height = cns.height;
    ctx.clearRect(0, 0, cns.width, cns.height);
    ctxd.clearRect(0, 0, cnsd.width, cnsd.height);
    ctxd.drawImage(img, 0, 0, cnsd.width, cnsd.height);
    var imgData = ctxd.getImageData(0, 0, cnsd.width, cnsd.height);
    var imgDataArr = imgData.data;
    for (var h = 0; h < cns.height; h += 8) {
        for (var w = 0; w < cns.width; w += 6) {
            if (time != 0 && typeof time === "number")
                setTimeout(drawText(w, h, imgDataArr), time);
            else
                drawText(w, h, imgDataArr)();
            // (function (w, h) {
            //     setTimeout(function () {
            //         var index = (w + cns.width * h) * 4;
            //         var r = imgDataArr[index + 0];
            //         var g = imgDataArr[index + 1];
            //         var b = imgDataArr[index + 2];
            //         var gray = getGray(r, g, b);
            //         ctx.fillText(img2Text(gray), w, h + 8);
            //     }, 500);
            // })(w, h);
        }
    }
}
function drawText(w, h, imgDataArr) {
    return function () {
        var index = (w + cns.width * h) * 4;
        var r = imgDataArr[index + 0];
        var g = imgDataArr[index + 1];
        var b = imgDataArr[index + 2];
        var gray = getGray(r, g, b);
        var char = img2Text(gray);
        if (ctx.measureText(char).width > maxCharSize)
            ctx.font = "bold " + maxCharSize + "px " + font.split(" ")[1];
        if (colorit === 1) {
            ctx.fillStyle = color !== "" ? color : ("rgb(" + r + "," + g + "," + b + ")");
        }
        ctx.fillText(char, w, h + 8);
        ctx.font = font;
    };
}
function checkChinese(ch) {
    var reg = new RegExp("[\\u4E00-\\u9FFF]+");
    return reg.test(ch);
}
$('#btn').click(function () {
    // document.all.imgfile.click();
    document.getElementById("choose").click();
});
$('#choose').change(function () {
    var reader = new FileReader();
    try {
        reader.readAsDataURL($(this)[0].files[0]);
        reader.onload = function () {
            $('#btn').text('请稍候...');
            img.src = reader.result;
        }
    } catch (error) {

    }
});
// bind('input propertychange')
$('.char').bind('change', function () {
    var i = parseInt($(this).attr('id').substring(9));
    if ($(this).val() !== "" && $(this).val().length <= 1)
        text[i] = $(this).val();
    if ($(this).val().length > 1) {
        $(this).val(text[i]);
        alert("只能输入一个字符");
    }
    $(this).attr('placeholder', text[i]);
});