
export const hasClass=(target,cname)=>{
  return target.className.match(new RegExp('(\\s|^)'+cname+'(\\s|$)')); 
};
export const addClass=(target,cname)=>{
  let nameArr=cname.split(' ');
  nameArr.map((v,k)=>{
    if(!!v&&!hasClass(target,v)){
      target.className+=' '+v;
    }
  });
};
export const removeClass=(target,cname)=>{
  let nameArr=cname.split(' ');
  nameArr.map((v,k)=>{
    if(!!v&&hasClass(target,v)){
      // var reg=new RegExp('(\\s|^)'+v+'(\\s|$)');
      let reg=new RegExp('(\\s|^)'+v);
      target.className=target.className.replace(reg,'');
    }
  });
};

export const toggleClass=(target,cname)=>{
  if(hasClass(target,cname)){
    removeClass(target,cname);
  }
  else{
    addClass(target,cname);
  }
};

export const resetObj=(obj)=>{
  let keys=Object.keys(obj);
  for(let i=0,j=keys.length;i<j;i++){
    obj[keys[i]]='';
  }
  return obj;
};

//对象赋值 深拷贝
export const cloneObj=(obj):any=>{
  let str='',newobj=obj.constructor===Array?[]:{};
  if(typeof obj!=='object'){
    return;
  }
  /*else if(window.JSON){//浏览器支持json解析
    str=JSON.stringify(obj);
    newobj=JSON.pares(str);
  }*/
  else{
    for(let i in obj){
      newobj[i]=typeof obj[i]==='object'?cloneObj(obj[i]):obj[i];
    }
  }
  return newobj;
};

//返回顶部
/*export const backTop=(st)=>{
  let timer=setInterval(function(){
    if(st<=0){
      st=0;
      clearInterval(timer);
      return;
    }
    st-=50;
  },1);
};*/

//获取当前页面--menu
export const getCurrent=(menu,str)=>{
  if(str){
    // 规定url书写规格。#/function/function1
    // str=str[0].slice(0,str[0].length-1);
    str=str[1];
    if(str.split('/').length==2){str='#'+str;}
    menu.map((v,k)=>{
      if(v.subMenu&&v.subMenu.length>0){
        let flag=false,ls=v.subMenu.length;
        v.subMenu.map((sv,sk)=>{
          if(sv.url==str){
            /*data.url='#'+sv.url;
            data.subTitle=sv.title;
            data.level=2;*/
            flag=true;
            sv.selected='active';
          }
          else{
            sv.selected='';
            let a=str.split('/');
            let url='/'+a[a.length-2];
            if(url==sv.url&&!flag){
              sv.selected='active';
              flag=true;
            }
          }
        });
        flag?(
          // data.title=v.title,
          v.selMenu='active',
          v.open='open',
          v.toggleSlide={
            height:ls*32+16,
          }
        ):(
          v.selMenu='',
          v.open='',
          v.toggleSlide={
            height:0,
          }
        );
      }
      else{
        if(v.url==str){
          /*data.url=v.url;
          data.title=v.title;
          data.subTitle='';
          data.level=1;*/
          v.selMenu='active';
        }
        else{
          v.selMenu='';
          !!v.subMenu&&v.subMenu.map((sv,sk)=>{
            sv.selected='';
          });
        }
      }
    });
  }
  return menu;
};
//获取当前页面--breadcrumb
export const getBreadcrumb=(menu,str)=>{
  if(str){
    str=str[1];
    if (str.split('/').length>0) {
      str='#'+str;
    }
    let data=[],tmp=[],level=-1,f=false;
    //获取当前页面--title
    const getTitle=(menu,str)=>{
      level++;
      menu.map((v,k):any=>{
        if(f) {return false;}
        if(v.url==str){
          let d={
            title:v.title,
            url:v.url,
          };
          tmp.push(d);
      /*    if(v.url == '#/training/training'){
            tmp.pop(d);
          }*/
          f=true;
          data=cloneObj(tmp);
          return data;
        }
        else{
          let ff=false;
          if(v.subMenu&&v.subMenu.length>0){
            let d={
              title:v.title,
              url:v.url,
            };
            tmp.push(d);
            ff=true;
            getTitle(v.subMenu,str);
          }
          // console.log(ff);
          if(ff) {tmp=[];}
        }
      });
      return data;
    };
    return getTitle(menu,str);
  }
};

// fullscreen
export const fs=(element)=>{
  if(!document.fullscreenElement&&/*!document.msFullscreenElement&&!document.mozFullScreenElement&&*/!document.webkitFullscreenElement){
    if(element.requestFullscreen){
      element.requestFullscreen();
    }
    else if(element.msRequestFullscreen){
      element.msRequestFullscreen();
    }
    else if(element.mozRequestFullScreen){
      element.mozRequestFullScreen();
    }
    else if(element.webkitRequestFullscreen){
      element.webkitRequestFullscreen();
    }
  }
  else{
    if(document.exitFullscreen){
      document.exitFullscreen();
    }
    /*else if(document.msExitFullscreen){
      document.msExitFullscreen();
    }
    else if(document.mozCancelFullScreen){
      document.mozCancelFullScreen();
    }*/
    else if(document.webkitExitFullscreen){
      document.webkitExitFullscreen();
    }
  }
};
/*let ele=document.getElementsByClassName('fs')[0];
fs(ele);*/
export const currentDate=(format)=>{
  let myDate = new Date();
  let year = myDate.getYear();        //获取当前年份(2位)
  let fullyear = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
  let month = myDate.getMonth() < 10 ? '0' + (myDate.getMonth()+1): myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
  let date = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();        //获取当前日(1-31)
  let week = myDate.getDay() < 10 ? '0' + myDate.getDay() : myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
  let time = myDate.getTime() < 10 ? '0' + myDate.getTime() : myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
  let hour = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours();       //获取当前小时数(0-23)
  let minute = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes();     //获取当前分钟数(0-59)
  let second = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds();     //获取当前秒数(0-59)
  let milliseconds = myDate.getMilliseconds() < 10 ? '0' + myDate.getMilliseconds() :  myDate.getMilliseconds();    //获取当前毫秒数(0-999)
  switch (format) {
  case 'YYYY':
    return fullyear;
  case 'YYYY-MM-DD':
    return fullyear + '-' + month + '-' + date;
  case 'YYYY-MM-DD hh:mm:ss':
    return fullyear + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second; 
  case 'timestamp':
    return Date.parse(myDate);
  default:
    break;
  }
};
export const copy = (element) => {
  try {
    element.select();
    document.execCommand('copy');
    return '已复制到粘贴板';
  } catch (error) {
    return '复制失败';
  }
};

export const autoAge = (date)=>{
  let ageStamp = currentDate('timestamp') - Date.parse(date);
  return ageStamp > 0 ? ageStamp/1000/60/60/24/365 : 0;
};













