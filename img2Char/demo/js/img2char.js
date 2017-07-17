var cns = $('#canvas')[0];
var ctx = cns.getContext('2d');
var cnsd = $('#imgdata')[0];
var ctxd = cnsd.getContext('2d');

var text = ['#', '&', '@', '%', '$', 'w', '*', '+', 'o', '?', '!', ';', '^', ',', '.', ' '];
var img = new Image();
var width = 1000;
var height = 600;
cns.width = width;
cns.height = height;
img.onload = initAndDrawText;

function img2Text(g) {
    var i = g % 16 === 0 ? parseInt(g / 16) - 1 : parseInt(g / 16);
    return text[i];
}

function getGray(r, g, b) {
    return 0.299 * r + 0.578 * g + 0.114 * b;
}

function initAndDrawText() {
    $('#btn').text('选择图片');
    var rem = img.width / img.height;
    cns.width = height * rem;
    cns.height = height;
    cnsd.width = cns.width;
    cnsd.height = cns.height;
    ctx.clearRect(0, 0, cns.width, cns.height);
    ctxd.clearRect(0, 0, cnsd.width, cnsd.height);
    ctxd.drawImage(img, 0, 0, cnsd.width, cnsd.height);
    var imgData = ctxd.getImageData(0, 0, cnsd.width, cnsd.height);
    var imgDataArr = imgData.data;
    for (var h = 0; h < cns.height; h += 8) {
        for (var w = 0; w < cns.width; w += 6) {
            var index = (w + cns.width * h) * 4;
            var r = imgDataArr[index + 0];
            var g = imgDataArr[index + 1];
            var b = imgDataArr[index + 2];
            var gray = getGray(r, g, b);
            ctx.fillText(img2Text(gray), w, h + 8);
        }
    }
}
$('#btn').click(function() {
    document.all.imgfile.click();
});
$('#choose').change(function() {
    var reader = new FileReader();
    reader.readAsDataURL($(this)[0].files[0]);
    reader.onload = function() {
        $('#btn').text('请稍候...');
        img.src = reader.result;
    }
});
$('.char').bind('input propertychange', function() {
    var i = parseInt($(this).attr('id').substring(9));
    if ($(this).val() !== "" && $(this).val().length <= 1)
        text[i] = $(this).val();
    if ($(this).val().length > 1) {
        $(this).val(text[i]);
        alert("只能输入一个字符");
    }
    $(this).attr('placeholder', text[i]);
});