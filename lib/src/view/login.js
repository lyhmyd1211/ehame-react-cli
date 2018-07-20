import React, { Component } from 'react';
import { Form, Card, message } from 'antd';
import store from '../redux-root/store';
import { getPowers } from '../redux-root/action/powers';
import './login.less';
import { Button } from 'antd';


class HorizontalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    document.onkeydown = (event) => {
      let e = event || window.event;
      if (e.keyCode === 13) {
        //this.handleSubmit(e);
      }
    };
  }
  
  state = {
    msg: '',
    showPassword: false,
  };
  componentDidMount() {
    
  }
  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if((values.username == undefined && values.password == undefined) || (values.username == '' && values.password == '')){
  //       this.setState({msg : '请输入用户名密码!'});
  //     }else if((values.username == undefined || values.username == '') && (values.password != undefined || values.password != '')){
  //       this.setState({msg : '请输入用户名!'});
  //     }else if((values.username != undefined || values.username != '') && (values.password == undefined || values.password == '')){
  //       this.setState({msg : '请输入密码!'});
  //     }else{
  //       if (!err) {
  //         $q.post($q.url + '/security/login', JSON.stringify(values), data => {
  //           if (data.status === 400) {
  //             this.setState({ msg: '账号不存在或密码错误!' });
  //           } else if (data.status === 499) {
  //             this.setState({ msg: '账号状态无效，请联系管理员启用账户后重新登录!' });
  //           } else if (data.status === 200) {
  //             $q.get($q.url + '/security/user/getUserByAcount/' + values.username, data => {
  //               window.sessionStorage.lastname = data.lastname;
  //               window.sessionStorage.orginfo = data.orginfo;
  //               window.sessionStorage.acount = data.acount;
  //               window.sessionStorage.id = data.id;
  //               window.sessionStorage.password = values.password;
  //               $q.get($q.url + '/security/authInfo', data => {
  //                 if (values.username === 'root' && data.permissions.length === 0) {
  //                   store.dispatch(getPowers(false));
  //                 } else if (data.permissions.length == 0) {
  //                   message.error('当前账户没有权限');
  //                 } else {
  //                   let obj = {};
  //                   data.permissions.map(v => {
  //                     obj[v] = true;
  //                   });
  //                   store.dispatch(getPowers(obj));
  //                 }
  //                 window.sessionStorage.permissions = data.permissions;
  //                 // locationHashDefault(data.permissions);
  //                 location.hash = '#/militiaStatistics';
  //               });
  //             });
  //           } else {
  //             this.setState({ msg: '服务器忙，稍候再试!' });
  //           }
  //         });
  //       }
  //     }
  //   });
  // };
  changeState = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };
  render() {
 
    
    return (
      <Card className="login-card">
        <Button onClick={()=>window.location.hash='/main'}>登录页</Button>
      </Card>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="loginDiv">
        <div className="logo" />
        <div className="bg-login">
          <WrappedHorizontalLoginForm />
        </div>
      </div>
    );
  }
}
