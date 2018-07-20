import API_PREFIX from '../view/content/apiprefix';
export const url = API_PREFIX+'/services';
import { message } from 'antd';
import i18no from './i18n.js';
const iferror = (error, xhr) => {
  if (error) {
    error(xhr);
  } else {
    errorAction(xhr);
  }
};

export const errorAction = (xhr)=>{
  if (xhr.status === 500 || xhr.status === 404) {
    message.error('服务器内部错误！');
  } else if (xhr.status === 401) {
    location.hash = '#/login';
  }else if(xhr.status === 403){
    message.error('无权操作');
  }
};
export const i18n = i18no;
export const get = function (url, success, error, notJSON) {
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status == 200) {
        if (notJSON) {
          success && success(xhr.responseText);
        } else {
          success && success(JSON.parse(xhr.responseText));
        }
      } else {
        iferror(error, xhr);
      }
    }
  };
  return xhr;
};


export const post = function (url, data, success, error, notJSON) {
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open('POST', url, true);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(data);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status == 200) {
        if (notJSON) {
          success && success(xhr.responseText);
        } else {
          success && success(JSON.parse(xhr.responseText));
        }
      } else {
        iferror(error, xhr);
      }
    }
  };
  return xhr;
};

export const put = function (url, data, success, error, notJSON) {
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open('PUT', url, true);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(data);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status == 200) {
        if (notJSON) {
          success && success(xhr.responseText);
        } else {
          success && success(JSON.parse(xhr.responseText));
        }
      } else if (xhr.status == 204) {
        success && success({'code':'1'});
      }else {
        iferror(error, xhr);
      }
    }
  };
  return xhr;
};

export const del = function (url, data, success, error, notJSON) {
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open('DELETE', url, true);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(data);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status == 200) {
        if (notJSON) {
          success && success(xhr.responseText);
        } else {
          success && success(JSON.parse(xhr.responseText));
        }
      } else if (xhr.status == 204) {
        success && success({'code':'1', readyState: xhr.readyState});
      } else {
        iferror(error, xhr);
      }
    } else if (xhr.readyState === 2) {
      success && success({'code':'1', readyState: xhr.readyState});
    }
  };
  return xhr;
};

export const getPath = (path, queryStr, dateStr) => {
  if (typeof queryStr !== 'undefined') {
    path += '?';
    let k = 0;
    for (let v in queryStr) {
      if (v === 'startDate' && typeof queryStr[v] !== 'undefined' && queryStr[v] !== null) {
        if (k > 0) {
          path += '&';
        }
        path = path + 'Q=' + dateStr + '_GE=' + encodeURIComponent(queryStr[v]);
        k++;
      } else if (v === 'endDate' && typeof queryStr[v] !== 'undefined' && queryStr[v] !== null) {
        if (k > 0) {
          path += '&';
        }
        path = path + 'Q=' + dateStr + '_LE=' + encodeURIComponent(queryStr[v]);
        k++;
      } else if(v === 'port' && typeof queryStr[v] !== 'undefined' && queryStr[v] !== null) {
        if(k > 0) {
          path += '&';
        }
        path = path + 'Q=' + v + '_LK=' + encodeURIComponent(queryStr[v]);
        k++;
      } else if (typeof queryStr[v] !== 'undefined' && queryStr[v] !== null) {
        if (k > 0) {
          path += '&';
        }
        path = path + 'Q=' + v + '_EQ=' + encodeURIComponent(queryStr[v]);
        k++;
      }
    }
    if(k === 0) {
      path = path.substring(0,path.length-1);
    }
  }
  return path;
};

export const formatDate = (date) => {
  return date.substring(0,4) + '-' + date.substring(4,6);
};
