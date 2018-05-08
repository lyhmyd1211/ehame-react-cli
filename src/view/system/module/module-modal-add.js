import React, { Component } from   'react';;

import { Form, Input, Button, Select } from 'antd';
const Option = Select.Option;
const la = $q.i18n;

import * as action from 'redux-root/action/system/role';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
function mapDispatchToProps(dispatch) {
  return bindActionCreators(action, dispatch);
}
@connect(
  state => ({ role: state.system.role }),
  mapDispatchToProps
)
class RoleModalAdd extends Component {


  render() {
    const { status } = this.props.role;
    const lk = 0;
    return (
      <div>
        <h2 style={{ marginBottom: 10 }}>{la['xz'][lk] /* '新增' */}</h2>
        <AddForm {...this.props} status={status} />
      </div>
    );
  }
}

export default RoleModalAdd;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
class AddForm extends React.Component {
  reset = () => {
    this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();//取消默认的行为
    this.props.form.validateFields((err, value) => {
      if (!err) {
        $q.post($q.url + '/moduledepartment/single', JSON.stringify(value), data => {
          if (data) {
            this.props.closeModal(true);
          }
        }, xhr => $q.errorAction(xhr), true);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const lk = 0;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label={la['mc'][lk]}//"名稱"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: la['cxwbtx'][lk]/* '此项为必填项' */,
            }],
          })(
            <Input />
            )}
        </FormItem>
        <FormItem
          label={la['mx'][lk]}//"描述"
          {...formItemLayout}
        >
          {getFieldDecorator('desp', {
            rules: [{
              required: true, message: la['cxwbtx'][lk]/* '此项为必填项！' */,
            }],
          })(
            <Input />
            )}
        </FormItem>
         <FormItem style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>{la['qr'][lk]/* 确认 */}</Button>
          <Button onClick={e => this.props.closeModal()}>{la['qx'][lk]/* 取消 */}</Button>
        </FormItem>
      </Form>
    );
  }
}
