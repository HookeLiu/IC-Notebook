/*! # 使用STC15W408AS的自动浇花器 */

/*! [img] [随便找的图.png] 电路图图片,需要另存为HTML文件查看.测试所以随便用了一个图
*/

#include <STC15.h>
#include <intrins.h>
#define u8  unsigned char
#define u16 unsigned int
#define u32 unsigned long
// 指示器
sbit LED0 = P1^2;
sbit BUZZ = P1^3;
/*缺少材料*/
// 传感器，使用集成ADC
sbit FL0  = P1^1;                                // ADC1
sbit FL1  = P1^0;                                // ADC0
sbit FL2  = P1^5;                                // ADC5
sbit dcen = P1^6;                                // 检测电源
//*/
// 水泵控制
sbit pot1 = P3^7;
sbit pot2 = P3^6;
sbit pot3 = P3^5;
sbit pwen = P3^4;                                // 升压板使能

void init(){
    P1ASF = 0x23;                                 // 设为ADC
}

void main(){
    u16 fHu[3] = {1,0,5};                         // 用于轮询湿度
    u16 fTh[3] = {256,512,300};                   // 设置不同花盆的干枯阈值             
    u8  fPu[4] = {7,6,5};                         // 作为调用浇花子程序的通道设置  
    u8 count;
    init();
    while(1){
       for(count = 3; count >= 0; count--){
           if(getADC(fHu[count]) < fTh[count]){
               pwen = 1;
               _nop_();
           }
       }
    }
}

u16 getADC(u8 CH){
    u8 count = 255;
    ADC_CONTR = 0xe8 | CH;
    _nop_();_nop_();_nop_();_nop_();             // 等待采样
    while(!(ADC_CONTR & 0x10) && count--);       // 等待转换
    ADC_CONTR &= ~0x10;

    return ADC_RES * 4 + ADC_RESL;               // 高8位左移，得到10位结果（0~1023）
}

void openPump(u8 CH){
    code u8 table[8] = {1,2,4,8,16,32,64,128};
    P3 |= table[CH];
}



/* <!--以下代码仅用于支持IC Notebook在浏览器中渲染-->
<!--IC Notebook V0.0.0(test)alpha By Hooke&JuYan github.com/HookeLiu/IC-Notebook-->
<!--本工具除了将源码转换为可查看的HTML文档之外, 还会解析源码中的富文本标识符("#!", "//!", "/*!")并输出对应的HTML-->
<!--以下代码仅用于支持IC Notebook在浏览器中渲染-->
<!--IC Notebook V0.0.0(test)alpha By Hooke&JuYan github.com/HookeLiu/IC-Notebook-->
<!--本工具除了将源码转换为可查看的HTML文档之外, 还会解析源码中的富文本标识符("#!", "//!", "/*!")并输出对应的HTML-->
<script type="text/javascript" src="http://lib.yhhtech.cn/applib/js/jquery-3.2.0.min.js"></script>    
<script type="text/javascript" src="RichHighLight.js"></script>    
<!--以上js脚本只是用于相关的文本处理与渲染. 若不放心安全性, 可以使用同功能的脚本替代或自行审查.(.min的经过压缩, 只是为了减少体积以便传输和保存)--> 
<script type="text/javascript">
    var str = document.body.innerHTML.split("/* <!--")[0];
    document.documentElement.innerHTML = "<h1>处理中, 请稍后</h1>";  // 先记录并清空原始内容, 看着清爽
    
    var keywords_c = 
[
    "if", "else", "while", "void", "return", "continue", "break", "static",
    "extern", "unsigned", "signed", "char", "short", "int", "long", "float",
    "double", "const", "sbit", "for", "code",
];
    console.log("执行");

    // 重新创建一个页面(但是有个问题, 遇到"＜／ｓｃｒｉｐｔ＞"之后字符串就会结束, 所以没法用这个方法创建完整网页了...不知道该咋办)
    document.documentElement.innerHTML = `
<!DOCTYPE html>
<html>
    <head>    
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />    
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=6.0,minimum-scale=1, user-scalable=yes" />    
        <link href="demo.css" rel="stylesheet" type="text/css" />    
        <title>C语言笔记HTML查看</title>
    </head>
    <body>    
        <div id="jsAlt" style="font-size:28px; display:block; color:#FF600E; white-space:nowrap; width:100%; z-index:128">亲，<wbr />本页面依赖JS来显示内容，<wbr />因为js被禁用了<wbr />所以这个页面就不能正常显示了呢，<wbr />如果您想访问此页面的话<wbr />请不要禁用JS，<wbr />也请不要使用省流量模式。    
        </div>    
        <div id="code" >  
            "喵喵喵~"
        </div>
    </body>
</html> 
`
  
    obj = document.getElementById("code");               // 把内容放到网页主体部分
    HighlightString(str, keywords_c, obj);
    
    var HTMLcode = obj.innerHTML;                        // 后续再考虑对输出做一些美化, 例如添加行号之类的
    var ostr = HTMLcode.split("\n");
    HTMLcode = "";
    var lineCount = 1;
    var lineMark  = "";
    for (var i = 0; i < ostr.length; i++){
        // 行号也会占地方, 为了好看...
        if (lineCount > 0) lineMark = "  " + lineCount.toString(); else if (lineCount > 10) lineMark = "0" + lineCount.toString(); else if (lineCount > 100) lineMark = lineCount.toString();
        HTMLcode += "[" + lineMark + "]　" + ostr[i] + "<br />";
        lineCount+= 1;
    } 
    obj.innerHTML = HTMLcode;
 
    //页面特性设置    
    $("#jsAlt").css("display", "none");           //若JS被禁用则不能隐藏提示文字  
</script>