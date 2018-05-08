import React, { Component } from   'react';;

import { Table, Spin, Button, Row, Col, Form, Input, Popconfirm, Modal, Collapse, message } from 'antd';

import RoleModal from './role/role-modal.js';
import * as action from 'redux-root/action/system/role';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    postService,
} from './../content/myFetch.js';
import API_PREFIX from './../content/apiprefix';

const la = $q.i18n;
const Panel = Collapse.Panel;

function mapDispatchToProps(dispatch) {
  return bindActionCreators(action, dispatch);
}
@connect(
  state => ({
    role: state.system.role,
    lk: state.language,
    powers: state.powers,
   }),
  mapDispatchToProps
)
export default class Role extends Component {
  state = {
    pagesize: 10,
    search: {},
    modalInfo: {
      visible: false,
    },
    loading: false,
  }
  submit = (search) => {
    this.setState({
      search,
    });
    this.getDate(1, search);
  }
  componentWillMount() {
    this.getDate(1);
  }
  getDate = (page, search) => {
    search = search || this.state.search;
    let getURL = $q.url + '/security/role/list/' + (page || 1) + '/' + (this.state.pagesize || 10);
    if (search.name_LK || search.desp_LK) {
      getURL += '?Q=name_LK=' + (search.name_LK || '') + '&Q=desp_LK=' + (search.desp_LK || '');
    }
    this.setState({
      loading: true,
    });
    $q.get(getURL, data => {
      this.props.getSystemRoleList(data);
      this.setState({
        loading: false,
      });
    });
  }
  showModal = (info) => {
    this.setState({
      modalInfo: {
        visible: true,
        type: info.type,
        id: info.id,
        name: info.name,
      },
    });
  }
  closeModal = (closeAndGetNewDate) => {
    this.setState({
      modalInfo: {
        visible: false,
      },
    });
    if (closeAndGetNewDate) {
      this.getDate(1);
    }
  }
  delete = (id) => {
    const lk = 0;
    $q.get($q.url + '/security/role/roleUser/' + id, data => {
      if (data.length !== 0) {
        message.warn(la['role03'][lk]);//該角色已綁定用戶，請先解除綁定後再刪除！
      } else {
        Modal.confirm({
          title: la['role02'][lk],//角色刪除操作慎重提示
          content: la['role01'][lk],//刪除角色將會一併刪除為該角色配置的許可權資訊，確認刪除嗎？
          okText: la['qr'][lk],//確認
          cancelText: la['qx'][lk],//取消
          onOk: (close) => {
            postService(API_PREFIX + `/services/confidentialBase/role/delete/${id}`, '', data => {
              if (data.retCode == '1') {
                close();
                this.getDate(1);
                message.success('删除成功！');
              } else {
                  message.error(data.retMsg);                  
                }              
            });
          },
        });
      }
    });
  }
  render() {
    const lk = 0;
    const { role } = this.props;

    const powers =this.props.powers;
    const columns = [{
      title: ' ',
      width: 40,
      render: (t, r, i) => (i + 1),
      className: 'center',
    }, {
      title: la['caoz'][lk],//操作
      width: 100,
      render: (t, r, i) => {
        return <span>
          <span title={la['role04'][lk]} /*許可權設置*/ onClick={this.showModal.bind(this, { type: 'power', id: r.id, name: r.name })}><i className="fa fa-cog" /></span>
          <span className="ant-divider" />
          <span title={la['role05'][lk]} /*用戶綁定*/ onClick={this.showModal.bind(this, { type: 'binding', id: r.id, name: r.name })}><i className="fa fa-users" /></span>
          <span className="ant-divider" />{
            ((powers && (!powers['10008.10102.004']))||r.defaultIn) ? null :
            <Popconfirm
            title={la['qrsc'][lk]} /*確定要刪除角色嗎？*/
            onConfirm={this.delete.bind(this, r.id)} okText={la['qr'][lk]} /*確認*/
            cancelText={la['qx'][lk]} /*取消*/>
            <span title={la['sc'][lk]} /*刪除*/><i className="fa fa-trash-o" /></span></Popconfirm>
          }
        </span>;
      },
    }, {
      title: la['mc'][lk],/*名稱*/
      dataIndex: 'name',
      render: (t, r) => <a onClick={this.showModal.bind(this, { type: 'modify', id: r.id })}>{t}</a>,
    }, {
      title: la['mx'][lk],/*描述*/
      dataIndex: 'desp',
    }, {
      title: la['zt'][lk],/*狀態*/
      dataIndex: 'statusDesp',
    }];
    console.log("role",role)
    return (
      <div className="sysUI">
        <Spin spinning={this.state.loading === true}>
        <Collapse style={{width: '100%',marginBottom:"20px"}} defaultActiveKey={['1']}>
              <Panel header="查询条件" key="1" disabled>
                <Row>
                  <RoleForm {...this.props} submitd={this.submit.bind(this)} />
                </Row>
              </Panel>
          </Collapse>
          <Collapse style={{width: '100%',marginBottom:"20px"}} defaultActiveKey={['1']}>
          <Panel header="用户列表" key="1" disabled>   
          <Row style={{marginTop:-10}}>
            <Button type="primary" className="but-tab" style={{marginBottom:5}} disabled={(powers && (!powers['10008.10102.001']))} onClick={this.showModal.bind(this, { type: 'add' })}>{la['xz'][lk]/*新增*/}</Button>
            <Col className="table-comm">
              <Table
                columns={columns}
                dataSource={role.list.data}

                rowKey="id" bordered
                pagination={{
                  pageSizeOptions: $q.pagArr,
                  current: role.list.page,
                  total: role.list.length,
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
              />
            </Col>
          </Row>
          </Panel>
          </Collapse>
        </Spin>
        <RoleModal {...this.props} modalInfo={this.state.modalInfo} closeModal={this.closeModal.bind(this)} />
      </div>
    );
  }
}


const FormItem = Form.Item;

@Form.create()
class RoleForm extends React.Component {
  reset = () => {
    this.props.form.resetFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();//取消默认的行为
    this.props.form.validateFields((err, value) => {
      if (!err) {
        this.props.submitd(value);
      }
    });
  }
  render() {
    const lk = 0;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label={la['mc'][lk]} /*名稱*/>
          {getFieldDecorator('name_LK')(
            <Input className="input-comm" />
          )}
        </FormItem>
        <FormItem label={la['mx'][lk]} /*描述*/>
          {getFieldDecorator('desp_LK')(
            <Input className="input-comm" />
          )}
        </FormItem>
        <FormItem>
          <Button className="but-tab" type="primary" htmlType="submit">{la['cx'][lk]/*查詢*/}</Button>
          <Button className="but-tab" style={{marginLeft:8}} onClick={this.reset}>{ la['cz'][lk] /*重置*/}</Button>
        </FormItem>
      </Form>
    );
  }
}
