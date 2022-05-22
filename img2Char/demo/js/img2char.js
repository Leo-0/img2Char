var cns = $('#canvas')[0];
var ctx = cns.getContext('2d');
var font = getFont();
ctx.font = font;
var maxCharSize = getMaxCharSize();
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
var minwidth = getMinWidth();
var resize = getResize();
var zoom = getZoom();
var perchar = getPerChar();
console.log("options:color=(rgb(r,g,b)|color|#xxxxxx),colorit=(yes|y),font=(10px sans-serif|font),maxcharsize=char,minwidth=int,perchar=(yes|y),resize=char,time=int,zoom=number");
function getQueryString(name, nopevalue, r) {
    var reg = r ? r : new RegExp("(^|[\?&])" + name + "=([^&]*)(&|$)", "i");
    var res = decodeURIComponent(window.location.href).match(reg);
    console.log(res);
    return res ? r ? typeof res[1] !== "undefined" ? res[1] : res[2] : res[2] : nopevalue;
}
function getMinWidth() {
    // var reg = /minwidth=([\d]+)/i;
    // var res = decodeURIComponent(window.location.href).match(reg);
    // return res ? parseInt(res[1]) : 0;
    return parseInt(getQueryString("minwidth", 0));
}
function getColorIt() {
    // var reg = /colorit=([01])/i;
    // var res = decodeURIComponent(window.location.href).match(reg);
    // return res ? parseInt(res[1]) : 0;
    return getQueryString("colorit", "no");
}
function getColor() {
    // var reg = /[\?&]color=[\"\']?((#[\da-fA-F]{6})|(#[\da-fA-F]{3})|(rgb\([\d]{1,3},[\d]{1,3},[\d]{1,3}\))|[a-zA-Z]+)[\"\']?(&|$)/i;
    // var res = decodeURIComponent(window.location.href).match(reg);
    // return res ? typeof res[1] !== "undefined" ? res[1] : res[2] : "";
    return getQueryString("color", "").replace(/^["']+|["']+$/gm, "");
}
function getFont() {
    // var reg = /font=[\"|\']([\d]+(\.[\d]+)?px [\S]+)[\"|\']/i;
    // var res = decodeURIComponent(window.location.href).match(reg);
    // return res ? res[1] : "10px sans-serif";
    return getQueryString("font", "10px sans-serif").replace(/^["']+|["']+$/gm, "");
}
function getTimeInterval() {
    // var reg = /time=[\d]+/i;
    // var res = decodeURIComponent(window.location.href).match(reg);
    // return res ? parseInt(res[1]) : 0;
    return parseInt(getQueryString("time", 0));
}
function getResize() {
    return ctx.measureText(getQueryString("resize", "")).width;
}
function getMaxCharSize() {
    // var reg = /[\?&]maxcharsize=["']([^"'])(["']|$)/i;
    var reg = /[\?&]maxcharsize=([\S])/i;
    return ctx.measureText(getQueryString("maxcharsize", "", reg)).width;
}
function getZoom() {
    return Number(getQueryString("zoom", 1));
}
function getPerChar() {
    return getQueryString("perchar", "no");
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
    window.scrollTo(0, 50);
    var rem = img.width / img.height;
    var cw = img.width > width ? width : img.width;
    cns.width = cw * zoom < minwidth && minwidth > 0 ? minwidth : cw * zoom;
    cns.height = cns.width / rem;
    cnsd.width = cns.width;
    cnsd.height = cns.height;
    ctx.clearRect(0, 0, cns.width, cns.height);
    ctxd.clearRect(0, 0, cnsd.width, cnsd.height);
    ctxd.drawImage(img, 0, 0, cnsd.width, cnsd.height);
    var imgData = ctxd.getImageData(0, 0, cnsd.width, cnsd.height);
    var imgDataArr = imgData.data;
    var i = 1;
    for (var h = 0; h < cns.height; h += 8) {
        for (var w = 0; w < cns.width; w += 6) {
            if (time && typeof time === "number")
                setTimeout(drawText(w, h, imgDataArr), time * i);
            else
                drawText(w, h, imgDataArr)();
            i = perchar.toLowerCase() === "yes" || perchar.toLowerCase() === "y" ? i + 1 : 1;
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
        if (maxCharSize > 0 && ctx.measureText(char).width > maxCharSize)
            ctx.font = font.replace(/\d+px/, maxCharSize + "px");
        if (parseInt(gray / text.length) >= 9 && checkChinese(char) && resize > 0)
            ctx.font = font.replace(/\d+px/, resize + "px");
        if (colorit.toLowerCase() === "yes" || colorit.toLowerCase() === "y")
            ctx.fillStyle = color !== "" ? color : ("rgb(" + r + "," + g + "," + b + ")");
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