import React, { Component } from   'react';;

import { Table, Spin, Button, Row, Col, Form, Input, Popconfirm, Collapse, message } from 'antd';

import DictionaryModal from './dictionary/dictionary-modal.js';

import * as action from 'redux-root/action/system/dictionary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
function mapDispatchToProps(dispatch) {
  return bindActionCreators(action, dispatch);
}


const la = $q.i18n;
const Panel = Collapse.Panel;

@connect(
  state => ({
    dictionary: state.system.dictionary,
    lk: state.language,
    powers: state.powers,
  }),
  mapDispatchToProps
)
export default class Dictionary extends Component {
  state = {
    loading: true,
    search: {},
    pagesize: 10,
    modalInfo: {
      visible: false,
    },
  }
  componentDidMount() {
    this.getData(1);
  }
  submit = (search) => {
    this.setState({
      search,
    });
    this.getData(1, search);
  }
  closeModal = (closeAndGetNewDate) => {
    this.setState({
      modalInfo: {
        visible: false,
      },
    });
    if (closeAndGetNewDate) {
      this.getData(1);
    }
  }
  getData = (page, search) => {
    search = search || this.state.search;
    let getURL = $q.url + `/lookup/list/${page}/${this.state.pagesize}?Q=parentId_L_EQ=0`;
    if (search.code_LK) {
      getURL += ('&Q=code_LK=' + search.code_LK);
    }
    if (search.desp_LK) {
      getURL += ('&Q=desp_LK=' + search.desp_LK);
    }
    $q.get(getURL, data => {
      this.props.getSystemDictionaryList(data);
      this.setState({
        loading: false,
      });
    });
  }
  del = id => {
    //删除
    const lk = 0;
    $q.del($q.url + '/lookup/single/' + id, '', ({readyState}) => {
      readyState != 4 && message.success(la['czcg'][lk]/* '操作成功！' */);
      this.getData(1);
    }, xhr => {
      message.success(la['czcg'][lk]/* '操作成功！' */);
      this.getData(1);
      $q.errorAction(xhr);
    });
  }
  showModal = (info) => {
    this.setState({
      modalInfo: {
        visible: true,
        type: info.type,
        id: info.id,
        data: info.data,
      },
    });
  }
  render() {
    const lk = 0;

    const type = [la['dancj'][lk]/* '單層級' */, la['duocj'][lk]/* '多層級' */];
    const columns = [{
      title: ' ',
      width: 40,
      render: (t, r, i) => (i + 1),
      className: 'center',
    }, {
      title: la['caoz'][lk]/* '操作' */,
      width: 90,
      render: (t, r, i) => {
        return <span>
          <span title={la['zilwh'][lk]/* "資料維護" */} onClick={this.showModal.bind(this, { type: 'maintenance', id: r.id, data: r })}>
            <i className="fa fa-cog" />
          </span>
          <span className="ant-divider" />
          <Popconfirm title={la['delWarn01'][lk]} onConfirm={this.del.bind(this, r.id)} okText={la['qr'][lk]/* "確定" */} cancelText={la['qx'][lk]/* "取消" */}>
            <span title={la['sc'][lk]/* "刪除" */}>
              <i className="fa fa-trash-o" />
            </span>
          </Popconfirm>
        </span>;
      },
    }, {
      title: la['zillxmc'][lk]/* '資料類型名稱' */,
      dataIndex: 'desp',
      render: (t, r) => <a onClick={this.showModal.bind(this, { type: 'modify', id: r.id, data: r })}>{t}</a>,
    }, {
      title: la['zillxbm'][lk]/* '資料類型編碼' */,
      dataIndex: 'groupCode',
    }, {
      title: la['cengjjglx'][lk]/* '層級結構類型' */,
      dataIndex: 'type',
      render: t => type[t],
    }, {
      title: la['chuangjsj'][lk]/* '創建時間' */,
      dataIndex: 'createDate',
    }];
    const powers =this.props.powers;

    return (
      <div className="sysUI">
        {/*<Spin spinning={this.state.loading === true}>*/}
        <Collapse style={{width: '100%',marginBottom:"20px"}} defaultActiveKey={['1']}>
             <Panel header="查询条件" key="1" disabled>
              <Row>
                <RoleForm lk={lk} submitd={this.submit} />
              </Row>
            </Panel>
          </Collapse>
          <Collapse style={{width: '100%'}} defaultActiveKey={['1']}>
             <Panel header="数据字典" key="1" disabled>
          <Row style={{ marginTop: '-10' }}>
            <Col style={{ marginBottom: '5' }}><Button type="primary" className="but-tab" disabled={(powers && (!powers['10003.10301.001']))} onClick={this.showModal.bind(this, { type: 'add' })}>{la['xz'][lk]/* 新增 */}</Button></Col>
            <Col className="table-comm">
              <Table
                columns={columns}
                dataSource={this.props.dictionary.list.data}
                rowKey="id" bordered
                pagination={{
                  pageSizeOptions: $q.pagArr,
                  current: this.props.dictionary.list.page,
                  total: this.props.dictionary.list.length,
                  showTotal: la['g*t'][lk],
                  onChange: (page, pageSize) => {
                    this.getData(page);
                  },
                  showSizeChanger: true,
                  onShowSizeChange: (current, pagesize) => {
                    this.setState({ pagesize }, () => {
                      this.getData(current);
                    });
                  },
                }}
              />
            </Col>
          </Row>
          </Panel>
          </Collapse>
        {/*</Spin>*/}
        <DictionaryModal lk={lk} powers={powers} modalInfo={this.state.modalInfo} closeModal={this.closeModal.bind(this)} />
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
    const { getFieldDecorator } = this.props.form;
    const lk = 0;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label={la['zillxmc'][lk]/* "資料類型名稱" */}>
          {getFieldDecorator('desp_LK')(
            <Input className="input-comm"/>
          )}
        </FormItem>

        <FormItem label={la['zillxbm'][lk]/* "資料類型編碼" */}>
          {getFieldDecorator('code_LK')(
            <Input className="input-comm"/>
          )}
        </FormItem>
        <FormItem>
          <Button className="but-tab" type="primary" htmlType="submit">{la['cx'][lk]/* 查詢 */}</Button>&nbsp;&nbsp;
          <Button className="but-tab" onClick={this.reset}>{la['cz'][lk]/* 重置 */}</Button>
        </FormItem>
      </Form>
    );
  }
}
