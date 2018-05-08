import {
  regex,
} from './regex.js';
const pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]'); 
export const checkPhoneMail = (rule, value, callback) => {
  if (!!value && !(regex.isMobilephone.test(value) || regex.isMail.test(value))) {
    callback('手机号或邮箱不合法!');
  } else {
    callback();
  }
};

export const checkPhone = (rule, value, callback) => {
  if (!!value && !regex.isMobilephone.test(value)) {
    callback('格式有误!');
  } else {
    callback();
  }
};


export const checkUserName = (rule, value, callback) => {
  if (!!value && !/^[a-zA-Z][a-zA-Z0-9_]{4,14}$/.test(value)) {
    callback('用户名由5-15位数字、字母、下划线组成 , 必须以字母开头');
  } else {
    callback();
  }
};

export const checkPwd = (rule, value, callback) => {
  if (!!value && !/[a-zA-Z0-9_]{6,16}$/.test(value)) {
    callback('密码由6-16位数字、字母、下划线组成 , 区分大小写');
  } else {
    callback();
  }
};

export const checkRealName = (rule, value, callback) => {
  if (!!value && !value.replace(/(^\s+)|(\s+$)/g, '').match(/^[\u4e00-\u9fa5]{2,4}$/)) { //我习惯用match
    callback('姓名必须是2-4中文!');
  } else {
    callback();
  }
};

export const checkCheckbox = (rule, value, callback) => {
  if (!!value && !value) {
    callback('您还未接受用户服务协议!');
  } else {
    callback();
  }
};

export const checkAllphone = (rule, value, callback) => {
  if (value) {
    if (regex.isPhone.test(value) || regex.isMobilephone.test(value)) {
      callback();
    } else {
      callback('手机格式不正确!');
    }
  } else {
    callback();
  }
};

export const checkEmail = (rule, value, callback) => {
  if (!!value && !regex.isMail.test(value)) {
    callback('电子邮箱错误!');
  } else {
    callback();
  }
};

export const checkMoney = (rule, value, callback) => {
  if (!!value && !regex.isIntOrFloat.test(value)) {
    callback('金额非零,且最多带四位小数!');
  } else {
    callback();
  }
};

export const checkSocialCreditCode = (rule, value, callback) => {
  if (!!value && !regex.isSocialCreditCode.test(value)) {
    callback('社会统一信用代码由18位数字或大写英文字母组成!');
  } else {
    callback();
  }
};

export const checkBusLicense = (rule, value, callback) => {
  if (!!value && !regex.isBusLicense.test(value)) {
    callback('工商注册号由15位数字组成!');
  } else {
    callback();
  }
};

export const checkOrgCode = (rule, value, callback) => {
  if (!!value && !regex.isOrgCode.test(value)) {
    callback('组织机构代码由9位数字或大写英文字母组成!');
  } else {
    callback();
  }
};

export const checkTaxId = (rule, value, callback) => {
  if (!!value && !regex.isTaxId.test(value)) {
    callback('纳税人识别号由15位、18或者20位数字或字母组成!');
  } else {
    callback();
  }
};




//新疆

export const checkNum1 = (rule, value, callback) => {
  if (!!value && !regex.isNum.test(value)) {
    callback('*请输入数字且最多为36位');
  } else {
    callback();
  }
};

export const checkNum = (rule, value, callback) => {
  if (!!value && !regex.isNum1.test(value)) {
    callback('*请输入数字且最多为10位');
  } else {
    callback();
  }
};
export const checkNum5 = (rule, value, callback) => {
  console.log('value',value);
  if (!!value && !regex.isNum5.test(value)) {
    callback('*请输入年份且最多为5位');
  } else {
    callback();
  }
};
//最多为十八个汉字
export const limitChars = (rule, value, callback) => {
  if (!!value && value.length > 18 ) {
    callback('*请输入正确字符且最多18位');
  } else if (pattern.test(value)) {
    callback('非法字符');
  } else {
    callback();
  }
};
export const limitChars1 = (rule, value, callback) => {
  if (!!value && value.length > 30) {
    callback('*请输入正确字符且最多30位');
  } else {
    callback();
  }
};
export const limitChars2 = (rule, value, callback) => {
  if (!!value && value.length > 128) {
    callback('*请输入正确字符且最多128位');
  } else {
    callback();
  }
};



export const checkCard = (rule, value, callback) => {
  let arg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
  if (value) {
    if (arg.test(value)) {
      callback();
    } else {
      callback('*身份证号不正确');
    }
  } else {
    callback();
  }
};


export const socialSecurity = (rule, value, callback) => {
  let arg = /^[0-9]{10}$/;
  if (value) {
    if (arg.test(value)) {
      callback();
    } else {
      callback('*请输入正确的社会保险号!');
    }
  } else {
    callback();
  }
};
export const limitChars3 = (rule, value, callback) => {
  if (!!value && value.length > 25) {
    callback('*请输入正确字符且最多25位');
  } else if (pattern.test(value)) {
    callback('非法字符');
  } else {
    callback();
  }
};

export const limitChars9 = (rule, value, callback) => {
  if (!!value && value.length > 20) {
    callback('*请输入正确字符且最多20位');
  } else {
    callback();
  }
};
export const limitChars5 = (rule, value, callback) => {
  if (!!value && value.length > 10) {
    callback('*最大为10个字符或5个汉字');
  } else {
    callback();
  }
};
export const limitChars2010 = (rule, value, callback) => {
  if (!!value && value.length > 20) {
    callback('*最大为20个字符或10个汉字');
  } else {
    callback();
  }
};
export const limitChars10 = (rule, value, callback) => {
  console.log('验证value',value);
  console.log('验证', pattern.test(value));
  
  if (!!value && value.length > 50  ) {
    callback('*请输入正确字符且最多50位');
  } else if (pattern.test(value)) {
    callback('非法字符');
  } 
  else {
    callback();
  }
};
export const specialCharacter = (rule, value, callback) =>{
  let pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]'); 
  if (value) {
    if (!pattern.test(value)) {
      callback();
    } else {
      callback('非法字符');
    }
  } else {
    callback();
  }
};