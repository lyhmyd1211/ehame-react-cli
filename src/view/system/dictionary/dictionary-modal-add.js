import React, { Component } from   'react';;
import { Form, Input, Button, Select } from 'antd';
import Config from '../../content/ruleConfig';
const Option = Select.Option;
const la = $q.i18n;

class DictionaryModalAdd extends Component {
  render() {
    return (
      <div>
        <h2 style={{ marginBottom: 10 }}>新增</h2>
        <AddForm {...this.props} />
      </div>
    );
  }
}

export default DictionaryModalAdd;
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
class AddForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();//取消默认的行为
    if (this.props.form.getFieldError('code')) {
      return;
    }
    this.props.form.validateFields((err, value) => {
      if (!err) {
        value.groupCode = value.code;
        $q.post($q.url + '/lookup/single', JSON.stringify(value), data => {
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
      $q.get($q.url + `/lookup/list?Q=code_EQ=${v}&Q=groupCode_EQ=${v}`, data => {
        if (data.length > 0) {
          this.props.form.setFields({
            code: {
              value: v,
              errors: [new Error('抱歉，资料类型编码已存在，请重新填写。')],
            },
          });
        }
      });
    }
  }
  render() {
    const {
      inputConfig,
      textAreaConfigLarge,
      selectConfig,
      inputMaxConfig,
      textAreaMaxConfig,
      onInput,
      onMinInput,
      onMaxInput,
      onTextAreaLarge,
      onTextAreaSmall,
    } = Config;
    const { getFieldDecorator } = this.props.form;
    const lk = 0;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="资料类型名称"
          {...formItemLayout}
        >
          {getFieldDecorator('desp', {
            rules: [{
              required: true, message:"请填写正确资料类型名称,最长40个字符！",max:40
            }],
          })(
            <Input className="input-comm"  onInput={onMaxInput}/>
            )}
        </FormItem>
        <FormItem
          label="资料类型编码"
          {...formItemLayout}
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true, message:"请填写正确资料类型编码,最长40个字符！",max:40
            }],
          })(
            <Input className="input-comm" onBlur={this.checkCode}  onInput={onMaxInput}/>
            )}
        </FormItem>
        <FormItem
          label="层级结构类型"
          {...formItemLayout}
        >
          {getFieldDecorator('type', {
            rules: [{
              required: true, message:"请选择层级结构类型！"
            }],
          })(
            <Select>
              <Option value="0">单层级</Option>
              <Option value="1">多层级</Option>
            </Select>
            )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button className="but-tab" type="primary" htmlType="submit" style={{ marginRight: 20 }}>保存</Button>
          <Button className="but-tab" onClick={e => this.props.closeModal()}>取消</Button>
        </FormItem>
      </Form>
    );
  }
}
