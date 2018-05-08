import React, { Component } from 'react';
import {
    Button,
    Table,
    Modal,
    Row,
    Col,
    Form,
    Input,
    Select,
    Cascader,
    message,
} from 'antd';
import {
    getService,
    postService,
    putService,
    deleteService,
} from './../content/myFetch.js';
import API_PREFIX from './../content/apiprefix';
import Config from './../content/ruleConfig';
const FormItem = Form.Item;
const Option = Select.Option;
const la = $q.i18n;

export default class UserUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = { orgData: [], languageData: [], statusData: [] };
  }
  componentDidMount() {
    $q.get($q.url + '/lookup/init/state', state => {
      this.setState({ state });
    });
    $q.get($q.url + '/lookup/init/port', port => {
      this.setState({ port });
    });
    $q.get($q.url + '/confidentialBase/organization/org/list', data => {
      const orgData = this.getCascadertree(data.root.list, '0');
      this.setState({
        orgData,
      });
    });
    $q.get($q.url + '/lookup/init/LANGUAGE', data => {
      this.setState({ languageData: data });
    });
    $q.get($q.url + '/lookup/init/STATUS', data => {
      this.setState({ statusData: data });
    });
  }

  getCascadertree = (data, pId) => {
    const arr = [];
    data.map(v => {
      if (v.pId === pId) {
        arr.push({
          value: v.id + '',
          label: v.orgName,
          isLeaf: v.leaf,
          children: !v.leaf ? this.getCascadertree(data, v.id) : undefined,
        });
      }
    });
    return arr;
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      values.id = this.props.data.id;
            // values.lastUpdateUserId = window.sessionStorage.id
      if (typeof values.orginfo !== 'undefined') {
        values.orginfo = values.orginfo.toString() + ',';
      }    
      values.status = parseInt(values.status);        
            // values.email='';
            // values.phone = '';

      console.log('~~~~~~',values);
      postService(API_PREFIX + '/services/confidentialBase/user/modify',values,data=>{
        if (data.retCode == '1') {
          message.success('修改成功！');
          this.props.cancelModalUpdateSi();
        }else{
          message.error(data.retMsg);
        }
      });
    });

  }
  render() {
    const { acount, lastname, orginfoCode, status, languageCode} = this.props.data;
    const {getFieldDecorator} = this.props.form;
    const { statusData, languageData, orgData } = this.state;
    let temp = orginfoCode.split(',');
    console.log('this.props.data;', this.props.data);
    
    
    const lk = 0;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const fstyle = {
      width: '100%',
    };

    return (
            <div>
              <Form>
                <Row>
                  <Col>
                    <FormItem
                        {...formItemLayout}
                        label={la['zh'][lk]}
                        hasFeedback>
                        {getFieldDecorator('acount', { rules: [{ pattern: new RegExp('^[A-Za-z0-9]+$'), message: la['qssyw'][lk] }, { required: true, message: la['qtxzh'][lk] }], initialValue:acount })(
                            <Input className="input-comm" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={la['xm'][lk]}
                        hasFeedback>
                        {getFieldDecorator('lastname', { rules: [{ required: true, message: la['qttxm'][lk] }], initialValue:lastname })(
                            <Input className="input-comm" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={la['zzjg'][lk]}>
                        {getFieldDecorator('orginfo', { rules: [{ required: true, message: la['qxzzzjg'][lk] }],
                          initialValue: temp,
                        })(
                            <Cascader 
                                placeholder={la['zzjg'][lk]}
                                options={this.state.orgData}
                                // loadData={this.loadData}
                                // onChange={this.onChange}
                                //改变
                                changeOnSelect
                                showSearch
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={la['zt'][lk]}>
                        {getFieldDecorator('status', { rules: [{ required: true, message: la['qxzzt'][lk] }], initialValue: status ? status.toString() : '' })(
                            <Select className="">
                                {
                                    statusData.map(function (s, j) {
                                      return <Option key={j} value={s.code}>{s.desp}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={la['yy'][lk]}>
                        {getFieldDecorator('languageCode', { rules: [{ required: true, message: la['qxzyy'][lk] }], initialValue: languageCode })(
                            <Select className="">
                                {
                                    languageData.map(function (s, j) {
                                      return <Option key={j} value={s.code}>{s.desp}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} offset={10}>
                    <FormItem>
                      <Button type="primary" htmlType="submit" className="but-comm" onClick={this.handleSubmit.bind(this)} size="large">修改</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
    );
  }
}

