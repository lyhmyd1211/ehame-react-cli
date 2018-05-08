/**
 * 用途：检查输入字符串是否符合正整数格式
 输入：
 s：字符串
 返回：
 如果通过验证返回true,否则返回false
 * @param s
 * @returns {boolean}
 */
export function isNumber( s ){
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    if (s.search(re) != -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 检查输入的身份证号是否正确
 输入:str  字符串
 返回:true 或 flase; true表示格式正确
 * @param str
 * @returns {boolean}
 */
export function checkCard(str) {
    //15位数身份证正则表达式
    var arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    //18位数身份证正则表达式
    var arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
    if (str.match(arg1) == null && str.match(arg2) == null) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * 用途：检查输入字符串是否只由汉字、字母、数字组成
 输入：
 value：字符串
 返回：
 如果通过验证返回true,否则返回false
 * @param s
 * @returns {boolean}
 */
export function isChinaOrNumbOrLett(s){//判断是否是汉字、字母、数字组成
    var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    }else{
        return false;
    }
}

/**
 * 用途：检查输入手机号码是否正确
 输入：
 s：字符串
 返回：
 如果通过验证返回true,否则返回false
 * @param s
 * @returns {boolean}
 */
export function checkMobile(s){
    var regu =/^[1][3][0-9]{9}$/;
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    }else{
        return false;
    }
}
export function getLen(str) {
    console.log('长度',str.replace(/[^ -~]/g, 'AA').length)
    return str.replace(/[^ -~]/g, 'AA').length;
}
export  function limitMaxLength(str, maxLength) {
    var result = [];
    for (var i = 0; i < maxLength; i++) {
        var char = str[i]
        if (/[^ -~]/.test(char))
            maxLength--;
        result.push(char);
    }
    return result.join('');
}



