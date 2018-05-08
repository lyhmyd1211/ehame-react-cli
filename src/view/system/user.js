import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Table, Modal, Select, Cascader, Popconfirm, Collapse, message, Tree, Message } from 'antd';
import UserUpdate from './userUpdate';
import Config from '../content/ruleConfig';
import './user.less';
import $ from 'jquery';
import {
  getService,
  postService,
} from './../content/myFetch.js';
import API_PREFIX from './../content/apiprefix';
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const la = $q.i18n;
const Panel = Collapse.Panel;

function isEmptyObject(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}
class AdvancedSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '', orgData: [], statusData: [] };
  }
  componentWillMount() {
    $q.get($q.url + '/confidentialBase/organization/org/list', data => {
      const orgData = this.getCascadertree(data.root.list, '0');
      this.setState({
        orgData,
      });
    });
    $q.get($q.url + '/lookup/init/STATUS', data => {
      this.setState({ statusData: data });
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('values.orginfo', values.orginfo);
      if (values.orginfo && values.orginfo.length !== 0) {
        values.orginfo = values.orginfo + '';
        if (values.orginfo[values.orginfo.length - 1] !== ',') {
          values.orginfo += ',';
        }
      } else {
        values.orginfo = null;
      }
      this.props.callbackParent(1, values);
    });

  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  onChange = (value, selectedOptions) => {
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
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

  render() {

    const { getFieldDecorator } = this.props.form;
    const { statusData, inputValue } = this.state;
    const lk = 0;
    console.log('inputValue', inputValue);
    return (
      <Form
        layout="inline"
        onSubmit={this.handleSearch}
      >
        <FormItem label={la['zh'][lk]}>
          {getFieldDecorator('acount')(
            <Input className="input-comm" placeholder={la['mc'][lk]} />
          )}
        </FormItem>
        <FormItem label={la['zzjg'][lk]}>
          {getFieldDecorator('orginfo')(
            <Cascader  getPopupContainer={()=>document.getElementsByClassName('y-main')[0]}
              placeholder={la['zzjg'][lk]}
              options={this.state.orgData}
              // loadData={this.loadData}
              // onChange={this.onChange}
              changeOnSelect
              style={{ width: '250px' }}
            />
          )}
        </FormItem>
        <FormItem label={la['zt'][lk]}>
          {getFieldDecorator('status')(
            <Select getPopupContainer={()=>document.getElementsByClassName('y-main')[0]} className="select-comm" placeholder={la['zt'][lk]} allowClear style={{ width: '150px' }}>
              {
                statusData.map(function (s, j) {
                  return <Option key={j} value={s.code}>{s.desp}</Option>;
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button className="but-tab" type="primary" htmlType="submit" >{la['cx'][lk]}</Button>
          <Button className="but-tab" style={{ marginLeft: 8 }} onClick={this.handleReset}>
            {la['cz'][lk]}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

class FormDemo extends React.Component {
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
      console.log('orgData', orgData);

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

  onChange = (value, selectedOptions) => {
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  }

  /*acount账号校验，新建不能重复，修改的时候除去本身账号也不能重复。zsj*/
  acountValidate = (rule, value, callback) => {
    const form = this.props.form;
    let url = `Q=acount_EQ=${value}`;
    let id = form.getFieldValue('id');
    if (id != null) {
      url = url + `&Q=id_L_NE=${id}`;
    }
    getService(API_PREFIX + `/services/confidentialBase/user/list/1/10?${url}`, data => {
      if (data.retCode === 1) {
        if (value && value.length > 1 && data.root.length > 0) {
          callback([new Error('抱歉，用户账户已存在，请重新填写。')]);
        } else {
          callback();
        }
      }
    });
  }

  render() {
    const {
      onInput,
      onMinInput,
      onMaxInput,
    } = Config;
    const { getFieldDecorator } = this.props.form;
    const { rowData } = this.props;
    const { statusData, languageData } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const lk = 0;
    console.log('rowdata', rowData);

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="ID"
          style={{ display: 'none' }}>
          {getFieldDecorator('id', { initialValue: rowData.id })(
            <Input className="input-comm" onInput={onMaxInput} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['zh'][lk]}
          hasFeedback>
          {getFieldDecorator('acount', { rules: [{ pattern: new RegExp('^[A-Za-z0-9]+$'), message: la['qssyw'][lk] }, { required: true, message: '*必填项,最长40个字符！', max: 80 }, { validator: this.acountValidate }], initialValue: rowData.acount })(
            <Input className="input-comm" onInput={onMaxInput} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['xm'][lk]}
          hasFeedback>
          {getFieldDecorator('lastname', { rules: [{ required: true, message: '*必填项,最长40个字符！', max: 80 }], initialValue: rowData.lastname })(
            <Input className="input-comm" onInput={onMaxInput} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['zzjg'][lk]}>
          {getFieldDecorator('orginfo', { rules: [{ required: true, message: la['qxzzzjg'][lk] }], initialValue: rowData.orginfo ? rowData.orginfo.split(',') : [] })(
            <Cascader className="cascader-comm"
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
          label={la['yx'][lk]}
          hasFeedback>
          {getFieldDecorator('email', { rules: [{ type: 'email', message: '请填写正确邮箱,最长80个字符！', max: 80 }], initialValue: rowData.email })(
            <Input className="input-comm" onInput={onMaxInput} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['lxdh'][lk]}>
          {getFieldDecorator('phone', { rules: [{ message: '请填写正确号码,最长80个字符！', max: 80 }], initialValue: rowData.phone })(
            <Input className="input-comm" onInput={onMaxInput} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['zt'][lk]}>
          {getFieldDecorator('status', { rules: [{ required: true, message: '*请选择状态' }], initialValue: rowData.status ? rowData.status.toString() : '' })(
            <Select  className="">
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
          {getFieldDecorator('languageCode', { rules: [{ required: true, message: la['qxzyy'][lk] }], initialValue: rowData.languageCode })(
            <Select className="">
              {
                languageData.map(function (s, j) {
                  return <Option key={j} value={s.code}>{s.desp}</Option>;
                })
              }
            </Select>
          )}
        </FormItem>

      </Form>
    );
  }
}

const WrappedDemo = Form.create()(FormDemo);

class Jmodal extends React.Component {
  state = { visible: false, msg: '', rowData: {} }
  showModal = (record) => {
    this.setState({
      visible: true,
      rowData: record,
    });
  }
  handleOk = (e) => {
    const lk = 0;
    e.preventDefault();
    let ob = this.refs.myform;
    let that = this;
    ob.validateFields((err, values) => {
      if (!err) {
        if (typeof values.orginfo !== 'undefined') {
          values.orginfo = values.orginfo.toString() + ',';
        }
        let nowTime = new Date().getTime();
        let clickTime = $(this).attr('ctime');
        if (clickTime != 'undefined' && (nowTime - clickTime < 10000)) {
          message.warning('操作过于频繁，稍后再试');
          return false;
        } else if (values.id) {
          $q.put($q.url + '/security/user/single', JSON.stringify(values), data => {
            if (data) {
              that.props.callbackParent();
              ob.resetFields();
              this.setState({
                visible: false,
              });

              if (data.retCode == '1') {
                message.success('保存成功');
              }

            } else {
              this.setState({
                msg: la['bcsb'][lk],
              });

              message.error(data.retMsg);
            }
          });
        } else {
          $q.post($q.url + '/security/user/single', JSON.stringify(values), data => {
            if (data) {
              that.props.callbackParent();
              ob.resetFields();
              this.setState({
                visible: false,
              });

              if (data.retCode == '1') {
                message.success('保存成功');
              }

            } else {
              this.setState({
                msg: la['ccsb'][lk],
              });

              message.error(data.retMsg);

            }
          });
        }
      }

    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    const lk = 0;
    return (
      <div className="user-modal">
        <Button type="primary" className="but-tab" style={{ marginBottom: 5, marginTop: -10 }} onClick={this.showModal}>{la['xz'][lk]}</Button>
        <Modal
          className="modal-comm"
          title={la['ccxry'][lk]}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.hideModal}
          okText={la['qr'][lk]}
          cancelText={la['qx'][lk]}
        >
          {this.state.visible ? <WrappedDemo {...this.props} ref="myform" rowData={this.state.rowData} /> : null}
          <div className="error-msg">{this.state.msg}</div>
        </Modal>
      </div>

    );
  }
}

class RoleModal extends Component {
  render() {
    const { visible, name } = this.props.modalInfo;
    return (
      <Modal
        title={'用户角色绑定'}
        className="modal-comm"
        visible={visible}
        footer={false}
        onCancel={() => this.props.hideModal()}
        maskClosable={false}
      >
        {visible ? <RoleBindingModal {...this.props} /> : null}
      </Modal>
    );
  }
}

class RoleBindingModal extends Component {
  state = {
    bindlist: false,
    pagesize: 10,
    data: false,
    selectedRowKeys: [],
    visible: false,
  }
  componentDidMount() {
    this.getDate1();
  }
  getDate1 = () => {
    $q.get($q.url + '/security/user/userRole/' + this.props.modalInfo.id, data => {
      let url = '';
      if (data.length === 0) {
        url += '-1';
      } else {
        url += data;
      }
      this.setState({
        data: url,
        selectedRowKeys: [],
      }, this.getDate(1, url));
    });
  }
  getDate = (page, url) => {
    url = url || this.state.data;
    $q.get($q.url + `/security/role/list/${page}/${this.state.pagesize}?Q=id_L_IN=` + url, bindlist => {
      this.setState({
        bindlist,
      });
    });
  }
  addbind = () => {
    this.setState({
      visible: true,
    });
  }
  closebind = (ischange) => {
    this.setState({
      visible: false,
    });
    if (ischange) {
      this.getDate1();
    }
  }
  delbind = () => {
    $q.del($q.url + '/security/user/userRole/' + this.props.modalInfo.id + '/' + this.state.selectedRowKeys, '', () => {
      this.getDate1();
    }, () => {
      this.getDate1();
    });
  }
  render() {
    const lk = 0;
    const { bindlist } = this.state;
    const columns = [{
      title: ' ',
      render: (t, r, i) => (i + 1),
      width: 40,
    }, {
      title: la['jjmc'][lk],
      dataIndex: 'name',
    }, {
      title: la['mx'][lk],
      dataIndex: 'desp',
    }, {
      title: la['zt'][lk],
      dataIndex: 'statusDesp',
    }];
    const powers = this.props.powers;
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col className="bordern">{la['yh'][lk]}-{this.props.modalInfo.name}-{la['ybdjslb'][lk]}</Col>
          <Col className="bordern">
            <Button className="but-tab" size="small" disabled={(powers && (!powers['10008.10100.091']))} onClick={this.addbind}>{la['bdjs'][lk]}</Button>
            <Button className="but-tab" size="small" disabled={(powers && (!powers['10008.10100.094'])) || this.state.selectedRowKeys.length === 0} onClick={this.delbind}>{la['jcbd'][lk]}</Button>
          </Col>
          <Col className="table-comm">
            {bindlist ? <Table
              className="table-comm"
              columns={columns}
              dataSource={bindlist.data}
              size="small"
              rowKey="id" bordered
              rowSelection={{
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selectedRowKeys,
                  });
                },
              }}
              pagination={{
                pageSizeOptions: $q.pagArr,
                current: bindlist.page,
                total: bindlist.length,
                showTotal: la['g*t'][lk],
                onChange: (page, pageSize) => {
                  this.getDate(page);
                },
                showSizeChanger: true,
                onShowSizeChange: (current, pagesize) => {
                  this.setState({ pagesize }, () => {
                    this.getDate(current);
                  });
                },
              }}
            /> : null}
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          width={800}
          className="modal-comm"
          onClose={this.closebind}
          footer={false}
        >
          {this.state.visible ? <RoleModalBindingAdd {...this.props} data={this.state.data} closebind={this.closebind.bind(this)} /> : null}
        </Modal>
      </div>
    );
  }
}

class RoleModalBindingAdd extends Component {
  state = {
    pagesize: 10,
    selectedRowKeys: [],
  }
  componentDidMount() {
    this.getDate(1);
  }
  getDate = (page) => {
    $q.get($q.url + `/security/role/list/${page}/${this.state.pagesize}?Q=id_L_NI=${this.props.data}`, bindlist => {
      this.setState({
        bindlist,
      });
    });
  }
  submit = () => {
    $q.post($q.url + '/security/user/userRole/' + this.props.modalInfo.id, JSON.stringify(this.state.selectedRowKeys), () => {
      this.props.closebind(true);
    }, xhr => {
      this.props.closebind(true);
    });
  }
  render() {
    const lk = 0;
    const bindlist = this.state.bindlist;
    const columns = [{
      title: ' ',
      render: (t, r, i) => (i + 1),
      width: 40,
    }, {
      title: la['jjmc'][lk],
      dataIndex: 'name',
    }, {
      title: la['mx'][lk],
      dataIndex: 'desp',
    }, {
      title: la['zt'][lk],
      dataIndex: 'statusDesp',
    }];
    return (
      <div>
        <Row style={{ marginTop: 10 }}>
          <Col className="bordern">{la['dxjslb'][lk]}</Col>
          <Col className="table-comm">
            {bindlist ? <Table
              columns={columns}
              dataSource={bindlist.data}
              size="small"
              rowKey="id" bordered
              rowSelection={{
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selectedRowKeys,
                  });
                },
              }}
              pagination={{
                pageSizeOptions: $q.pagArr,
                current: bindlist.page,
                total: bindlist.length,
                showTotal: la['g*t'][lk],
                onChange: (page, pageSize) => {
                  this.getDate(page);
                },
                showSizeChanger: true,
                onShowSizeChange: (current, pagesize) => {
                  this.setState({ pagesize }, () => {
                    this.getDate(current);
                  });
                },
              }}
            /> : null}
          </Col>
          <Col style={{ textAlign: 'right' }}>
            <Button className="but-tab" style={{ marginRight: 10 }} onClick={() => this.props.closebind()}>{la['qx'][lk]}</Button>
            <Button className="but-tab" type="primary" onClick={this.submit}>{la['qr'][lk]}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

class OrgBindingViewModal extends Component {
  state = {
    bindlist: false,
    pagesize: 10,
    data: [],
    noBind: true,
    selectedRowKeys: [],
    visible: false,
    gData: [],
    expandedKeys: [],
    autoExpandParent: true,
    dataList: [],
    personId: this.props.orgModalInfo.id,
    personName: this.props.orgModalInfo.name,
    treeSelectKeys: [],
    defaultSelectKeys: [],
    defaultIds: [],
    orgMap: [],
    orgId: [],
    showBindBtn: false,
  }
  getTreeData() {
    getService(API_PREFIX + '/services/confidentialBase/organization/tree/companyorglist', data => {
      console.log('data', data);

      this.setState({
        gData: data.root.list,
      }, () => {
        const generateList = (data) => {
          for (let i = 0; i < data.length; i++) {
            const node = data[i];
            if (node.id) {
              this.state.orgMap.push({
                orgId: node.id,
                key: node.key,
              });
            }
            if (node.children) {
              generateList(node.children);
            }
          }
        };
        generateList(this.state.gData);
        this.getRelationData();
      });
    });
  }
  getRelationData = () => {
    let queryFilter = 'Q=personId_S_EQ=' + this.state.personId;
    getService(API_PREFIX + `/services/confidentialBase/humanOrgInquire/inquire/list?${queryFilter}`, relationList => {
      console.log('relationList.root.list', relationList);
      let defaultIds = [];
      let defaultSelectKeys = [];
      relationList && relationList.root.list.map((item) => {
        defaultIds.push(item.orgId);
      });
      this.state.orgMap && this.state.orgMap.map((item) => {
        if (defaultIds.indexOf(item.orgId) > -1) {
          defaultSelectKeys.push(item.key);
        }
      });
      if (relationList.root.list.length == 0) {
        this.setState({
          noBind: true,
          defaultSelectKeys: defaultSelectKeys,
        });
      } else {
        this.setState({
          noBind: false,
          defaultSelectKeys: defaultSelectKeys,
        });
      }


    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  onSelect = (selectedKeys, info) => {
    const gData = this.state.gData;
    const getId = (gData) => {
      gData.map((item) => {
        if (item.key == selectedKeys[0]) {
          console.log('id', item.id);
          this.setState({
            id: item.id,
            disableAdd: false,
          }, () => {
            /* if (this.state.id== undefined) {
               message.warning('未选择正确的组织机构');
             }else{*/
            getService(API_PREFIX + `/services/confidentialBase/organization/info/${this.state.id}`, res => {
              console.log('res', res.root);
              this.setState({
                upgradeOrg: res.root.upgradeOrg,
                orgId: res.root.id,
              });
            }
            );
            /* } */
          });
          return item.id;
        }
        if (item.hasOwnProperty('children')) {
          getId(item.children);
        }
      });
    };
    getId(gData);
  }
  onNodeCheck = (defaultSelectKeys, info) => {
    let orgId = [];
    this.state.orgMap && this.state.orgMap.map((item) => {
      if (defaultSelectKeys.indexOf(item.key) > -1) {
        orgId.push(item.orgId);
      }
    });
    this.setState({
      defaultSelectKeys,
      orgId: Array.from(new Set(orgId)),
      showBindBtn: true,
    });
  }
  handleOrgBind = () => {

    let body = {
      personId: this.state.personId,
      orgIds: this.state.orgId,
    };
    console.log('body', body);
    if (this.state.noBind) {
      postService(API_PREFIX + '/services/confidentialBase/humanOrgInquire/inquire/add', body, data => {
        if (data.retCode === 1) {
          Message.success(data.retMsg);
        } else {
          Message.error(data.retMsg);
        }
      });
    } else {
      if (this.state.defaultSelectKeys.length > 0) {
        postService(API_PREFIX + '/services/confidentialBase/humanOrgInquire/inquire/update/person', body, data => {
          if (data.retCode === 1) {
            Message.success(data.retMsg);
          } else {
            Message.error(data.retMsg);
          }
        });
      } else {
        getService(API_PREFIX + `/services/confidentialBase/humanOrgInquire/inquire/delete/person/${this.state.personId}`, data => {
          if (data.retCode === 1) {
            Message.success(data.retMsg);
          } else {
            Message.error(data.retMsg);
          }
        });
      }
    }
  }
  componentDidMount() {
    this.getTreeData();
  }
  render() {
    console.log('person', this.state.personId);
    console.log('orgId', this.state.orgId);
    console.log('this.state.defaultSelectKeys', this.state.defaultSelectKeys);

    const loop = data => data && data.map((item) => {
      if (item.id) {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
      } else {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} dataRef={item} selectable={false} >
              {loop(item.children)}
            </TreeNode>
          );
        }
      }

      return <TreeNode key={item.key} title={item.title} />;
    });
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col className="bordern">查看权限
          </Col>
          <Col className="bordern">账户:
          {this.state.personName}</Col>
          <Col className="bordern">
            <Button type="primary" className="but-tab" size="small" onClick={this.handleOrgBind} style={{ display: this.state.showBindBtn ? 'block' : 'none' }}>绑定</Button>
          </Col>
        </Row>
        <Tree
          showLine
          checkable
          onCheck={this.onNodeCheck}
          checkedKeys={this.state.defaultSelectKeys}
          defaultExpandedKeys={this.state.defaultSelectKeys}
        >
          {loop(this.state.gData)}
        </Tree>
      </div>
    );
  }
}
class OrgBindingAuditModal extends Component {
  state = {
    bindlist: false,
    pagesize: 10,
    data: [],
    noBind: true,
    selectedRowKeys: [],
    visible: false,
    gData: [],
    expandedKeys: [],
    autoExpandParent: true,
    dataList: [],
    personId: this.props.orgModalInfo.id,
    personName: this.props.orgModalInfo.name,
    defaultSelectKeys: [],
    defaultIds: [],
    orgMap: [],
    orgId: [],
    showBindBtn: false,
  }
  getTreeData() {
    getService(API_PREFIX + '/services/confidentialBase/organization/tree/army/all', data => {
      console.log('data', data);

      this.setState({
        gData: data.root.list,
      }, () => {
        const generateList = (data) => {
          for (let i = 0; i < data.length; i++) {
            const node = data[i];
            if (node.id) {
              this.state.orgMap.push({
                orgId: node.id,
                key: node.key,
              });
            }
            if (node.children) {
              generateList(node.children);
            }
          }
        };
        generateList(this.state.gData);
        this.getRelationData();
      });
    });
  }
  getRelationData = () => {
    let queryFilter = 'Q=personId_S_EQ=' + this.state.personId;
    getService(API_PREFIX + `/services/confidentialBase/humanOrgRelation/relation/list?${queryFilter}`, relationList => {
      console.log('relationList.root.list', relationList);
      let defaultIds = [];
      let defaultSelectKeys = [];
      relationList && relationList.root.list.map((item) => {
        defaultIds.push(item.orgId);
      });
      this.state.orgMap && this.state.orgMap.map((item) => {
        if (defaultIds.indexOf(item.orgId) > -1) {
          defaultSelectKeys.push(item.key);
        }
      });
      if (relationList.root.list.length == 0) {
        this.setState({
          noBind: true,
          defaultSelectKeys: defaultSelectKeys,
        });
      } else {
        this.setState({
          noBind: false,
          defaultSelectKeys: defaultSelectKeys,
        });
      }


    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  onSelect = (selectedKeys, info) => {
    const gData = this.state.gData;
    const getId = (gData) => {
      gData.map((item) => {
        if (item.key == selectedKeys[0]) {
          console.log('id', item.id);
          this.setState({
            id: item.id,
            disableAdd: false,
          }, () => {
            /* if (this.state.id== undefined) {
               message.warning('未选择正确的组织机构');
             }else{*/
            getService(API_PREFIX + `/services/confidentialBase/organization/info/${this.state.id}`, res => {
              console.log('res', res.root);
              this.setState({
                upgradeOrg: res.root.upgradeOrg,
                orgId: res.root.id,
              });
            }
            );
            /* } */
          });
          return item.id;
        }
        if (item.hasOwnProperty('children')) {
          getId(item.children);
        }
      });
    };
    getId(gData);
  }
  onNodeCheck = (defaultSelectKeys, info) => {
    let orgId = [];
    this.state.orgMap && this.state.orgMap.map((item) => {
      if (defaultSelectKeys.indexOf(item.key) > -1) {
        orgId.push(item.orgId);
      }
    });
    this.setState({
      defaultSelectKeys,
      orgId: Array.from(new Set(orgId)),
      showBindBtn: true,
    });
  }
  handleOrgBind = () => {

    let body = {
      personId: this.state.personId,
      orgIds: this.state.orgId,
    };
    console.log('body', body);
    if (this.state.noBind) {
      postService(API_PREFIX + '/services/confidentialBase/humanOrgRelation/relation/add', body, data => {
        if (data.retCode === 1) {
          Message.success(data.retMsg);
        } else {
          Message.error(data.retMsg);
        }
      });
    } else {
      if (this.state.defaultSelectKeys.length > 0) {
        postService(API_PREFIX + '/services/confidentialBase/humanOrgRelation/relation/update/person', body, data => {
          if (data.retCode === 1) {
            Message.success(data.retMsg);
          } else {
            Message.error(data.retMsg);
          }
        });
      } else {
        getService(API_PREFIX + `/services/confidentialBase/humanOrgRelation/relation/delete/person/${this.state.personId}`, data => {
          if (data.retCode === 1) {
            Message.success(data.retMsg);
          } else {
            Message.error(data.retMsg);
          }
        });
      }
    }
  }
  componentDidMount() {
    this.getTreeData();
  }
  render() {
    console.log('person', this.state.personId);
    console.log('orgId', this.state.orgId);
    console.log('this.state.defaultSelectKeys', this.state.defaultSelectKeys);

    const loop = data => data && data.map((item) => {
      if (item.id) {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
      } else {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} dataRef={item} selectable={false} >
              {loop(item.children)}
            </TreeNode>
          );
        }
      }

      return <TreeNode key={item.key} title={item.title} />;
    });
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col className="bordern">审核权限
          </Col>
          <Col className="bordern">账户:
          {this.state.personName}</Col>
          <Col className="bordern">
            <Button className="but-tab" size="small" onClick={this.handleOrgBind} style={{ display: this.state.showBindBtn ? 'block' : 'none' }}>绑定</Button>
          </Col>
        </Row>
        <Tree
          showLine
          checkable
          onCheck={this.onNodeCheck}
          checkedKeys={this.state.defaultSelectKeys}
          defaultExpandedKeys={this.state.defaultSelectKeys}
        >
          {loop(this.state.gData)}
        </Tree>
      </div>
    );
  }
}
import { connect } from 'react-redux';
@connect(
  state => ({
    lk: state.language,
    powers: state.powers,
  }),
)
class User extends Component {
  state = {
    data: [],
    current: 1,
    length: 0,
    pageSize: 10,
    queryStr: '',
    loading: false,
    rowData: {},
    UpdateSi: false, //控制修改-modal显隐的标志
    dataUpdateSi: [],//修改-modal的内容
    newKeySi: 0,     //修改-modal的key值
    newKey: 0,
    modalInfo: {
      visible: false,
    },
    orgShow: false,
    orgModalInfo: {
      orgShow: false,
    },
  };
  cancelModalOrgBind = () => {
    this.setState({
      orgModalInfo: {
        orgShow: false,
      },
      newKey: this.state.newKey + 1,
    });

  }
  resetPasword = (id) => {
    $q.post($q.url + '/security/user/resetPwd/' + id, {}, bindlist => {
      this.setState({
        bindlist,
      });
    });
  }
  showModal = (info) => {
    console.log('info!!!!!!!!!!!!', info);
    this.setState({
      modalInfo: {
        visible: true,
        id: info.id,
        name: info.name,
      },
    });
  }
  showOrgModal = (info) => {
    this.setState({
      orgModalInfo: {
        orgShow: true,
        id: info.id,
        name: info.name,
      },
    });

  }
  showModalUpdate = (value) => {
    this.setState({
      dataUpdateSi: value,
      UpdateSi: true,
      newKeySi: this.state.newKeySi + 1,
    });
  }
  cancelModalUpdateSi = () => {
    this.setState({
      UpdateSi: false,
    });
    this.fetch();
  }
  hideModal = (closeAndGetNewDate) => {
    this.setState({
      modalInfo: {
        visible: false,
      },
    });
    if (closeAndGetNewDate) {
      this.fetch();
    }
  }
  handleTableChange = (pagination) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    let ob = this.refs.queryForm;
    let that = this;
    ob.validateFields((err, values) => {
      if (values.orginfo && values.orginfo.length !== 0) {
        values.orginfo = values.orginfo + '';
        if (values.orginfo[values.orginfo.length - 1] !== ',') {
          values.orginfo += ',';
        }
      } else {
        values.orginfo = null;
      }
      that.fetch({
        pageSize: pagination.pageSize,
        current: pagination.current,
      }, values);
    });
  }
  handleRowChange = (record) => {
    this.refs.editRow.showModal(record);
  }
  fetch = (page, queryStr) => {
    //---------------------------------------------
    // const lk = 0;
    //---------------------------------------------
    let path = API_PREFIX + '/services/confidentialBase/user/list' + '/' + (page || this.state.current) + '/' + this.state.pageSize; //selflogin/extUser/list
    queryStr = queryStr || this.state.queryStr;
    if (queryStr) {
      this.setState({
        queryStr,
        loading: true,
      });
    }
    if (!isEmptyObject(queryStr)) {
      path += '?';
      let k = 0;
      for (let v in queryStr) {
        if (v === 'acount' && typeof queryStr[v] !== 'undefined') {
          if (k > 0) {
            path += '&';
          }
          path = path + 'Q=acount_LK=' + encodeURIComponent(queryStr[v]);
          k++;
        } else if (queryStr[v] && typeof queryStr[v] !== 'undefined') {
          if (k > 0) {
            path += '&';
          }
          path = path + 'Q=' + v + '_EQ=' + encodeURIComponent(queryStr[v]);
          k++;
        }
      }
      if (k === 0) {
        path = path.substring(0, path.length - 1);
      }
    }
    getService(path, (data) => {
      this.setState({
        loading: false,
        data: data.root,
        // length: data.root.length
      });
    });
  }
  componentDidMount() {
    this.fetch(this.state.pagination);
  }

  delete = (record) => {
    console.log('record', record);
    const lk = 0;
    $q.del($q.url + '/security/user/single/' + record.id, {}, res => {
      if (res.code == '1') {
        //message.success('删除成功!');
        this.fetch(1);
      } else {
        this.fetch(1);
        message.error('删除不成功，请刷新后再试');
      }
    }, xhr => {
      /* if (xhr.status === 204) {
           this.fetch(1);
           message.success('删除成功!');
       }
       $q.errorAction(xhr);*/
    }
    );
    //this.fetch(1);
  }

  render() {
    //---------------------------------------------
    const lk = 0;
    const powers = this.props.powers;
    //---------------------------------------------
    // console.log('this.state.data',this.state.data)
    const UserUpdates = Form.create()(UserUpdate);
    const columns = [{
      title: la['xh'][lk],
      dataIndex: 'index',
      render: (text, record, index) => { return index + 1; },
    }, {
      title: la['caoz'][lk],
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          <span>
            {

              <span title={la['yhjgsz'][lk]} onClick={this.showOrgModal.bind(this, { id: record.id, name: record.acount, a: record })}><i className="fa fa-key" /></span>

            }
            <span className="ant-divider" />
            {

              <span title={la['yhjssz'][lk]} onClick={this.showModal.bind(this, { id: record.id, name: record.acount, a: record })}><i className="fa fa-cog" /></span>

            }
            {/* <Popconfirm title={la['czmm'][lk] + '?'} onConfirm={this.resetPasword.bind(this, record.id)} okText={la['qr'][lk]} cancelText={la['qx'][lk]}><span title={la['czmm'][lk]}><i className="fa fa-key" /></span></Popconfirm> */}
            <span className="ant-divider" />
            {
              ((powers && (!powers['10008.10102.004'])) || (record.id != 110)) ?
                <Popconfirm
                  title={la['qrsc'][lk]} /*確定要刪除嗎？*/
                  onConfirm={this.delete.bind(this, record)}
                  okText={la['qr'][lk]} /*確認*/
                  cancelText={la['qx'][lk]} /*取消*/>
                  <span title={la['sc'][lk]} /*刪除*/><i className="fa fa-trash-o" /></span></Popconfirm>
                : null
            }
          </span>
        );
      },
    }, {
      title: la['zh'][lk],
      dataIndex: 'acount',
      render: (t, r) => <a onClick={this.showModalUpdate.bind(this, r)}>{t}</a>,
    }, {
      title: la['xm'][lk],
      dataIndex: 'lastname',
    },
    //  {
    //   title: la['zzjg'][lk],
    //   dataIndex: 'orginfoName',
    //   // render: (text, record, index) => { if (text) { let temp = text.split('->'); return temp[temp.length - 1]; } else { return ''; } },
    // }, 
    {
      title: la['zt'][lk],
      dataIndex: 'statusDesp',
    }];
    return (
      <div className="sysUI">
        <Collapse style={{ width: '100%', marginBottom: "20px" }} defaultActiveKey={['1']}>
          <Panel header="查询条件" key="1" disabled>
            <WrappedAdvancedSearchForm ref="queryForm" callbackParent={this.fetch} lk={lk} />
          </Panel>
        </Collapse>
        <Collapse style={{ width: '100%', marginBottom: "20px" }} defaultActiveKey={['1']}>
        <Panel header="用户管理" key="1" disabled>
        <Jmodal ref="editRow" rowData={this.state.rowData} data={this.state.data} callbackParent={this.fetch} lk={lk} />
        <div className="table-comm">
          <Table columns={columns}
            rowKey={record => record.id}
            dataSource={this.state.data.list}
            pagination={{
              pageSizeOptions: $q.pagArr,
              current: this.state.data.page,
              total: this.state.data.length,
              showTotal: la['g*t'][lk],
              onChange: (current, pageSize) => {
                this.setState({ current, pageSize }, () => {
                  this.fetch();
                });
              },
              showSizeChanger: true,
              onShowSizeChange: (current, pageSize) => {
                this.setState({ current, pageSize }, () => {
                  this.fetch();
                });
              },
            }}
            loading={this.state.loading}
            bordered
          />
        </div>
        </Panel>
        </Collapse>
        <RoleModal powers={this.props.powers} modalInfo={this.state.modalInfo} hideModal={this.hideModal} lk={lk} />
        <Modal
          className="modal-comm"
          key={this.state.newKeySi}
          title={'用户信息修改'}
          visible={this.state.UpdateSi}
          onCancel={this.cancelModalUpdateSi.bind(this)}
          footer={null}
        >
          <UserUpdates
            data={this.state.dataUpdateSi}
            cancelModalUpdateSi={this.cancelModalUpdateSi.bind(this)}
          />
        </Modal>
        <Modal
          className="modal-comm"
          key={'org' + this.state.newKey}
          title={'用户机构设置'}
          visible={this.state.orgModalInfo.orgShow}
          onCancel={this.cancelModalOrgBind.bind(this)}
          footer={null}
        >
          <OrgBindingViewModal
            {...this.state} cancelModalOrgBind={this.cancelModalOrgBind.bind(this)}
          />
          {/* <OrgBindingAuditModal
            {...this.state} cancelModalOrgBind={this.cancelModalOrgBind.bind(this)}
          />  */}
        </Modal>
      </div>
    );
  }
}

export default User;