import React, { Component } from   'react';;

import { Table, Spin, Button, Row, Col, Form, Input, Popconfirm } from 'antd';

import ModuleModal from './module/module-modal.js';
import * as action from 'redux-root/action/system/role';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const la = $q.i18n;
function mapDispatchToProps(dispatch) {
  return bindActionCreators(action, dispatch);
}
@connect(
  state => ({ role: state.system.role,lk: state.language }),
  mapDispatchToProps
)
export default class Module extends Component {
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
    let getURL = $q.url + '/moduledepartment/list/' + (page || 1) + '/' + (this.state.pagesize || 10);
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
        desp:info.desp,
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
   $q.del($q.url + `/moduledepartment/single/${id}`, '', () => {
              close();
              this.getDate(1);
            }, xhr => {
              if (xhr.status === 204) {
                close();
                this.getDate(1);
              }
              $q.errorAction(xhr);
            }, true);
  }
  render() {
    const lk = 0;
    const { role } = this.props;
    const columns = [{
      title: ' ',
      width: 40,
      render: (t, r, i) => (i + 1),
      className: 'center',
    }, {
      title: la['caoz'][lk],//操作
      width: 90,
      render: (t, r, i) => {
        return <span>
          <span title={la['role04'][lk]} /*許可權設置*/ onClick={this.showModal.bind(this, { type: 'power', id: r.id, name: r.name,desp:r.desp })}><i className="fa fa-cog" /></span>
          <span className="ant-divider" />{
            r.defaultIn ? null :
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
    }];
    return (
      <div>
        <Spin spinning={this.state.loading === true}>
          <Row>
            <RoleForm {...this.props} submitd={this.submit.bind(this)} />
          </Row>
          <Row style={{marginTop:10}}>
            <Col className="bordern">{la['role06'][lk]/*角色列表*/}</Col>
            <Col className="bordern"><Button onClick={this.showModal.bind(this, { type: 'add' })}>{la['xz'][lk]/*新增*/}</Button></Col>
            <Col>
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
        </Spin>
        <ModuleModal {...this.props} modalInfo={this.state.modalInfo} closeModal={this.closeModal.bind(this)} />
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
            <Input />
          )}
        </FormItem>
        <FormItem label={la['mx'][lk]} /*描述*/>
          {getFieldDecorator('desp_LK')(
            <Input />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">{la['cx'][lk]/*查詢*/}</Button>
          <Button style={{marginLeft:8}}  onClick={this.reset}>{ la['cz'][lk] /*重置*/}</Button>
        </FormItem>
      </Form>
    );
  }
}
