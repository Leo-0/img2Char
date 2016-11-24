# img2Char
使用canvas，将图片转换成字符画.
选择图片后显示转化的字符画，可以设置字符.
#原理
这里主要用到canvas的一个API,`getImageData(x,y,width,height)`,具体看[w3school](http://www.w3school.com.cn/tags/canvas_getimagedata.asp).
<br />
然后根据灰度值计算公式：`0.299 * r + 0.578 * g + 0.114 * b`,[wiki/Grayscale](https://en.wikipedia.org/wiki/Grayscale).
<br />
将图像上的每个像素的颜色转化成对应的灰度值，再根据灰度值替换成字符.
#截图：
1.原图1
![image](https://github.com/Leo-0/img2Char/blob/master/img2Char/screenshot/image_1.jpg)
2.转化后截图1
![image](https://github.com/Leo-0/img2Char/blob/master/img2Char/screenshot/screenshot_1.png)
3.原图2
![image](https://github.com/Leo-0/img2Char/blob/master/img2Char/screenshot/image_2.jpg)
4.转化后截图2
![image](https://github.com/Leo-0/img2Char/blob/master/img2Char/screenshot/screenshot_2.png)
#注意
并不是所有的图片转化后显示的效果都很明显，具体还要看图片上像素颜色的分布。
