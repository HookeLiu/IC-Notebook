
var stateTable = // 根据编译原理做的有限自动机
[
    /*                   0    1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29|-1是退出 */
    /*  +, -        */ [ 25, -1, -1, -1, -1, -1, -1, -1,  9, -1, 10, -1, 12, -1, 29, -1, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* *            */ [ 25, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 29, -1, 18, 17, 19, 20, 19, -1, 23, 22, -1, -1, 28, 27, 28, 29],
    /* /            */ [ 16, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 29, -1, 14, 17, 19, 19, 21, -1, 22, 24, -1, -1, 28, 27, 28, 29],
    /* \n           */ [ 25, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 29, -1, -1, -1, 19, 19, 19, -1, 22, 22, -1, -1, 28, -1, -1, -1],
    /* x,X          */ [ 15,  2, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 29, 15, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* e,E          */ [ 15, -1,  3,  3, -1,  8, -1, -1, -1, -1, 10, -1, 12, -1, 29, 15, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* .            */ [  4, -1, -1, -1, -1,  6, -1, -1, -1, -1, 10, -1, 12, -1, 29, -1, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* !            */ [ 25, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 17, -1, -1, 17, 22, 19, 19, -1, 22, 22, -1, -1, 27, 27, 28, 29],
    /* "            */ [ 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, 11, -1, 12, -1, 29, -1, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* '            */ [ 12, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 13, -1, 29, -1, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* ident(G->++) */ [ 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 29, 15, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* 1 - 9        */ [  5,  5,  3,  3,  7,  5,  7,  7,  7,  7, 10, -1, 12, -1, 29, 15, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* #            */ [ 26, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 29, -1, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* 0            */ [  1,  5,  3,  3,  7,  5,  7,  7,  7,  7, 10, -1, 12, -1, 29, 15, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* a-f          */ [ 15, -1,  3,  3, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 29, 15, -1, 17, 19, 19, 19, -1, 22, 22, -1, -1, 28, 27, 28, 29],
    /* other        */ [ 25, -1, -1, -1, -1, -1, -1, -1, -1, -1, 10, -1, 12, -1, 29, -1, -1, 17, 19, 19, 19, -1, 22, 22, -1, 25, 28, 27, 28, 29]
];
var highlightClassName = // 设计一些高亮类型以便后续不同的着色渲染
[
    "error", "hexNumber", "number", "symbol", "maySymbol", "comment_H",
    "comment_single", "comment_mul", "comment_HTML_H", "comment_HTML_single",
    "comment_HTML_mul", "ident",  "char",  "string",  "keyword1",
];
var keywords_c =         // 预设常见的C语言关键字
[
    "if", "else", "while", "void", "return", "continue", "break", "static",
    "extern", "unsigned", "signed", "char", "short", "int", "long", "float",
    "double", "const",
];
/* 返回字符标记
  0        1           2           3           4           5            6          7
  +,-      *           /           \n,\0       x, X        e, E         .          !
  8        9          10          11          12          13           14         15
  "        '          _,g-z,G-Z   1-9         #           0            A-F,a-f    Other
*/
function getCharType(c){
    if(c == "+" || c == "-")        return 0;
    else if(c == "*")               return 1;
    else if(c == "/")               return 2;
    else if(c == "\n")              return 3;
    else if(c == "x" || c == "X")   return 4;
    else if(c == "e" || c == "E")   return 5;
    else if(c == ".")               return 6;
    else if(c == "!")               return 7;
    else if(c == "\"")              return 8;
    else if(c == "'")               return 9;
    else if(c == "_" || (c >= "g" && c <= "z") || (c >= "G" && c <= "Z"))   return 10;
    else if(c >= "1" && c <= "9")   return 11;
    else if(c == "#")               return 12;
    else if(c == "0")               return 13;
    else if((c >= "A" && c <= "F") || (c >= "a" && c <= "f"))               return 14;   // 返回是按顺序的. 比如这一行不处理e,E, 因为return 5 的时候就处理了.
    else return 15;
}

/*
 对字符串进行匹配, 返回处理完成时的自动机节点位置和字符串
*/
function stringType(str){
    var  typ, i, leng;
    var  strGet = "";
    var  state = 0, curState = 0;
    leng = str.length;
    for(i = 0; i < leng; i++){                      // 遍历字符串
        typ = getCharType(str.charAt(i));
        if(str.charAt(i) == '\\'){                  // 处理转义字符
            i++;
            strGet += '\\';
            typ = getCharType(str.charAt(i));       // 遇到\就直接复制并判断下一个字符
        }
        curState = stateTable[typ][state];          // 当前状态含义是当前在自动机里的下一个
        if(curState == -1){
            break;                                  // -1是结束标志
        }
        strGet += str.charAt(i);
        state   = curState;
    }
    return { "str": strGet, "state": state };
}
/*
 主函数: 分析整个输入对象(转为字符串处理), 输出相应的HTML
*/
function HighlightString(str, keylist, obj){
    var i = 0, leng, r, rStr, highType;
    str  = htmlRestore(str);                        // 避免原始字符串中含有HTML符号转义的麻烦
    leng = str.length;                              // str是原始字符串
    obj.innerHTML = "";                             // 先把原网页中待处理的部分清空
    while(1){                                       // 使用条件判断break来跳出循环比较方便
        r = stringType(str);
        rStr = r.str;
        if(r.state == 0)                            // 未进行识别(可能是空字符串或者遇到了错误)
            break;
        i += rStr.length;
        str = str.substr(rStr.length, leng - i);    // 去掉已处理部分, str每次取rStr的后部分. 

        highType = getStringHighlightType(r.state, rStr, keylist);
        if(highType != 8 && highType != 9 && highType != 10){
                                                    // 除了指定的富文本标识符("#!", "//!", "/*!")之外的内容都作为HTML
            rStr = HTMLEncode(rStr);                // 转义内容
            obj.innerHTML += '<span class="RichHighLight_' + highlightClassName[highType] + '">' + rStr + '</span>';
            rStr = "";
        }
        else{                                       // 处理富文本
            var h = -1;
            var rtKey = ["img", "plot", "---", "#"]  
            rStr = rStr.split(/[\[ \] \n]/g);       // 先按空格和定界符分隔, 以便判断关键词与符号
            for(var i = 0; i < rStr.length; i++){   // 去掉空字符串避免干扰
                if(rStr[i] == ''){
                    rStr.splice(i,1);
                i = i-1;
                }
            }
            switch ( rtKey.indexOf(rStr[1]) ){
                case 0: obj.innerHTML += '<img width="23.333%" src="' + rStr[2] + '" alt="' + rStr[3] + '" /><br /> <span>' + rStr[3] + '</span>';
                break;   
                case 1: obj.innerHTML += '<div id="' + rStr[3] + '" data-function="' + rStr[2] + '" > </div>';  break;   
                case 2: obj.innerHTML += '<hr />';                                                              break;                                           
                case 3: document.title = rStr[2]; obj.innerHTML += "<h1>" + rStr[2] + "</h1><hr />";        break;                                            
            }
            // 对于多个井号的, 需要按井号的数量确定h级别
            if ( rStr[1][0] == "#" && rStr[1][rStr[1].length - 1] == "#" && rStr[1].length > 1 && rStr[1].length < 7 )
                obj.innerHTML += '<h' + rStr[1].length + '>' + rStr[3] + '</h' + rStr[1].length + '>';
            rStr = "";
        }
    }
}
/* stateTable对应的高亮类型
  0                     1               2                  3
 错误                   hex数字         一般数字           符号,自动机带的符号
  4                     5               6                  7
 其它内容,可能是符号    #注释(预处理)   // 注释            多行注释
  8                     9               10                 11
 #!内容                 //!内容         /*!内容            标识符
  12                    13              14
  '',字符               "" 字符串       关键字1
*/
function getStringHighlightType(state, str, keylist_1){
    var typ = 0;
    switch(state){
    case 3:  typ = 1;  break;                       // [a~f],[A~F],[0~9]    
    case 1:                                         // 0
    case 5:                                         // [0~9]
    case 7:  typ = 2;  break;                       // [0~9]
    case 4:                                         // .                
    case 16: typ = 3;  break;                       // /                   
    case 25: typ = 4;  break;                       // [symbol]                           
    case 28: typ = 5;  break;                       // [!\n],else                                    
    case 14:                                        // /                
    case 29: typ = 6;  break;                       // [!\n],else                        
    case 21: typ = 7;  break;                       // /                        
    case 27: typ = 8;  break;                       // [!\n],!                
    case 17: typ = 9;  break;                       // [!\n],!                            
    case 24: typ = 10; break;                       // /                        
    case 15:                                        // ident,[![0~9]ident]                    
        if( keylist_1.indexOf(str) > -1 )           // 判断str是不是keylist里指定的关键词
            typ = 14;
        else
            typ = 11; 
        break;
    case 13: typ = 12; break;                       // '
    case 11: typ = 13; break;                       // "
    }
    return typ;
}
// HTML转义
function HTMLEncode(str){
    if (str.length === 0) return "";                // 空字符串就没必要处理了
    var s = "";
    s     = str.replace(/&/g, "&amp;");
    s     = s.replace(/</g, "&lt;");
    s     = s.replace(/>/g, "&gt;");
    s     = s.replace(/ /g, "&nbsp;");
    s     = s.replace(/\'/g, "&#39;");
    s     = s.replace(/\"/g, "&quot;");
    return s;
}
// HTML反转义
function htmlRestore(str){
    if (str.length === 0) return "";                        
    var s = "";
    s     = str.replace(/&amp;/g, "&");
    s     = s.replace(/&lt;/g, "<");
    s     = s.replace(/&gt;/g, ">");
    s     = s.replace(/&nbsp;/g, " ");
    s     = s.replace(/&#39;/g, "\'");
    s     = s.replace(/&quot;/g, "\"");
    return s;
}