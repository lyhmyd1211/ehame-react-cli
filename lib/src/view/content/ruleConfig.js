const Config = {
  numberConfig: {
    rules: [{
      required: true,

      message: "*必填项,最长20个正数！",
    }],
  },
  selectConfig: {
    rules: [{
      required: true,
      message: "*必填项！",
    }],
  },
  inputConfig: {
    rules: [{
      required: true,
      message: "*必填项,最长20个字符！",
      max: 20,
    }],
  },
  weightConfig: {
    rules: [{
      required: true,
      message: "*必填项,最长32个字符！",
      max: 32,
    }],
  },
  textAreaConfigLarge: {
    rules: [{
      required: true,
      message: "*必填项,最长500个字符！",
      max: 500,
    }],
  },
  textAreaConfigSmall: {
    rules: [{
      required: true,
      message: "*必填项,最长200个字符！",
      max: 200,
    }],
  },
  inputMaxConfig: {
    rules: [{
      required: false,
      message: "*最长32个字符！",
      max: 32,
    }],
  },
  inputMaxConfig2: {
    rules: [{
      required: false,
      message: "*最长36个字符！",
      max: 36,
    }],
  },
  textAreaMaxConfigLarge: {
    rules: [{
      required: false,
      message: "*最长500个字符！",
      max: 500,
    }],
  },
  textAreaMaxConfigSmall: {
    rules: [{
      required: false,
      message: "*最长200个字符！",
      max: 200,
    }],
  },
  textAreaMaxConfigSmaller: {
    rules: [{
      required: false,
      message: "*最长100个字符！",
      max: 100,
    }],
  },
  valueLowerLimitConfig: {
    rules: [{
      required: true,
      message: "*必填项,不能小于0",
    }],
  },
  valueUpperLimitConfig: {
    rules: [{
      message: "不能小于50，大于150",
      max: 150,
    }],
  },
  onTenInput: (e) => {
    let maxLength = 10;
    if (getLen(e.target.value) > maxLength)
      e.target.value = limitMaxLength(e.target.value, maxLength);
  },
  onMinInput: (e) => {
    let maxLength = 20;
    if (getLen(e.target.value) > maxLength)
      e.target.value = limitMaxLength(e.target.value, maxLength);
  },
  onInput: (e) => {
    let maxLength = 32;
    if (getLen(e.target.value) > maxLength)
      e.target.value = limitMaxLength(e.target.value, maxLength);
  },
  onInputSetting: (e) => {
    let maxLength = 36;
    if (getLen(e.target.value) > maxLength)
      e.target.value = limitMaxLength(e.target.value, maxLength);
  },
  onMaxInput: (e) => {
    let maxLength = 40;
    if (getLen(e.target.value) > maxLength)
      e.target.value = limitMaxLength(e.target.value, maxLength);
  },
  onTextAreaSmall: (e) => {
    let maxLength = 200;
    if (getLen(e.target.value) > maxLength)
      e.target.value = limitMaxLength(e.target.value, maxLength);
  },
  onTextAreaLarge: (e) => {
    let maxLength = 500;
    if (getLen(e.target.value) > maxLength)
      e.target.value = limitMaxLength(e.target.value, maxLength);
  },
  onNumInput: (e) => {
    if (e.target.value < 0) {
      e.target.value = '0';
    }
  }
}

function getLen(str) {
  console.log('长度',str.replace(/[^ -~]/g, 'AA').length)
    return str.replace(/[^ -~]/g, 'AA').length;
}
function limitMaxLength(str, maxLength) {
    var result = [];
    for (var i = 0; i < maxLength; i++) {
        var char = str[i]
        if (/[^ -~]/.test(char))
            maxLength--;
        result.push(char);
    }
    return result.join('');
}
export default Config;