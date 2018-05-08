import React, { Component } from   'react';;
import { Form, Input, Button, Select } from 'antd';
const Option = Select.Option;
const la = $q.i18n;

class DictionaryModalModify extends Component {
  render() {
    return (
      <div>
        <h2 style={{ marginBottom: 10 }}>修改</h2>
        <AddForm {...this.props} />
      </div>
    );
  }
}

export default DictionaryModalModify;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
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
        value.id = this.props.modalInfo.data.id;
        value.groupCode = value.code;
        //http://10.110.200.103/services/lookup/single
        $q.put($q.url + '/lookup/single', JSON.stringify(value), data => {
          if (data) {
            this.props.closeModal(true);
          }
        }, xhr => $q.errorAction(xhr), true);
      }
    });
  }
  checkCode = (e) => {
    const v = e.target.value;
    if (v) {
      $q.get($q.url + `/lookup/list?Q=code_EQ=${v}&Q=groupCode_EQ=${v}&Q=id_L_NE=${this.props.modalInfo.data.id}`, data => {
        if (data.length > 0) {
          this.props.form.setFields({
            code: {
              value: v,
              errors: [new Error(la['zillxbmycz'][0]/* '抱歉，資料類型編碼已存在，請重新填寫。' */)],
            },
          });
        }
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const info = this.props.modalInfo.data;
    const lk = 0;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label={la['zillxmc'][lk]/* '資料類型名稱' */}
          {...formItemLayout}
        >
          {getFieldDecorator('desp', {
            rules: [{
              required: true, message: la['cxwbtx'][lk]+',最长40个字符！',max:40 /* '請輸入資料類型名稱!' */,
            }],
            initialValue: info.desp,
          })(
            <Input className="input-comm" />
            )}
        </FormItem>
        <FormItem
          label={la['zillxbm'][lk]/* '資料類型編碼' */}
          {...formItemLayout}
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true, message: la['cxwbtx'][lk]+',最长40个字符！',max:40 /* '請輸入資料類型名稱!' */,
            }],
            initialValue: info.code,
          })(
            <Input className="input-comm" onBlur={this.checkCode} />
            )}
        </FormItem>
        <FormItem
          label={la['cengjjglx'][lk]/* '層級結構類型' */}
          {...formItemLayout}
        >
          {getFieldDecorator('type', {
            rules: [{
              required: true, message: la['cxwbtx'][lk] /* '請輸入資料類型名稱!' */,
            }],
            initialValue: info.type + '',
          })(
            <Select className="select-comm">
              <Option value="0">{la['dancj'][lk]/* '單層級' */}</Option>
              <Option value="1">{la['duocj'][lk]/* '多層級' */}</Option>
            </Select>
            )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button className="but-tab" type="primary" htmlType="submit" style={{ marginRight: 20 }}>{la['bc'][lk]/* 保存 */}</Button>
          <Button className="but-tab" onClick={e => this.props.closeModal()}>{la['qx'][lk]/* 取消 */}</Button>
        </FormItem>
      </Form>
    );
  }
}
