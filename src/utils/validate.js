/**
 * 过滤特殊字符
 */
export function stripscript(str) {
    //格式 RegExp("[在中间定义特殊过滤字符]")
    var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——| {}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
/**
 * 
 * 验证手机号
 */
export function validateMobile(value){
    let reg= /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (reg.test(value)) {
        return false;
    } else {
        return true;
    }
}

/***
 * 验证邮箱
 */
export function validateEmail(value) {
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (reg.test(value)) {
        return false;
    } else {
        return true;
    }
}
/**
 * 验证密码
 */
export function validatePass(value) {
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    return reg.test(value) ? false : true;
}