import React, { Component } from   'react';;
import RoleModalBindingAdd from './role-modal-binding-add.js';
import { Row, Col, Button, Table, Modal, Input } from 'antd';
const la = $q.i18n;
const Search = Input.Search;
class RoleModalBinding extends Component {
  state = {
    bindlist: false,
    pagesize: 10,
    data: false,
    selectedRowKeys: [],
    visible: false,
    search:'',
    searchvalue:'',
  }
  componentDidMount() {
    // http://10.110.200.103/services/security/role/roleUser/1
    this.getDate1();
  }
  reset = ()=>{
    this.setState({
      search:'',
      searchvalue:'',
    },()=>{
      this.getDate1();
    });
  }
  getDate1 = () => {
    $q.get($q.url + '/security/role/roleUser/' + this.props.modalInfo.id, data => {
      let url = '';
      if (data.length === 0) {
        url += '-1';
      } else {
        url += data;
      }
      this.setState({
        data: url,
        selectedRowKeys: [],
      },()=> this.getDate(1, url));
    });
  }
  getDate = (page, url) => {
    url = url || this.state.data;
    let listurl = $q.url + `/security/user/list/${page}/${this.state.pagesize}?Q=id_L_IN=` + url;
    if (this.state.search) {
      listurl += ('&Q=acount_LK=' + this.state.search);
    }
    $q.get(listurl, bindlist => {
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
    //http://10.110.200.103/services/security/role/roleUser/130/0,1,6,7
    $q.del($q.url + '/security/role/roleUser/' + this.props.modalInfo.id + '/' + this.state.selectedRowKeys, '', res => {
      console.log('res', res);
      if (res.code==='1') {
        this.getDate1();
      }
    }, xhr => {
      this.getDate1();
      $q.errorAction(xhr);
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
      title: la['zh'][lk],//'帳戶',
      dataIndex: 'acount',
    }, {
      title: la['yx'][lk],//'Email',
      dataIndex: 'businessEmail',
    }, {
      title: la['xm'][lk],//'姓名',
      dataIndex: 'lastname',
    }, {
      title: la['zt'][lk],//'狀態',
      dataIndex: 'statusDesp',
    }];
    const powers = this.props.powers;
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col className="bordern">{la['role06'][lk]/* 角色列表 */}</Col>
          <Col className="bordern">
            <Search
              value={this.state.searchvalue}
              onChange={(e)=>{
                this.setState({
                  searchvalue:e.target.value,
                });
              }}
              placeholder={la['zh'][lk]}
              style={{ width: 200 }}
              onSearch={search => this.setState({search},()=>{
                this.getDate(1);
              })}
            />
            <Button className="but-tab" style={{ marginLeft: 8 }} onClick={()=>this.setState({ search:this.state.searchvalue }, () => {
              this.getDate(1);
            })}>{la['cx'][lk]/* 重置 */}</Button>
            <Button className="but-tab" style={{marginLeft:8}} onClick={this.reset}>{la['cz'][lk]/* 重置 */}</Button>

          </Col>
          <Col className="bordern">
            <Button className="but-tab" disabled={(powers && (!powers['10008.10102.091']))} size="small" onClick={this.addbind}>{la['role05'][lk]/* 綁定用戶 */}</Button>
            <Button className="but-tab" size="small" disabled={(powers && (!powers['10008.10102.094'])) ||this.state.selectedRowKeys.length===0} onClick={this.delbind}>{ la['role08'][lk] /* 解除綁定 */}</Button>
          </Col>
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
                current: bindlist.page,
                total: bindlist.length,
                showTotal: la['g*t'][lk],//(total, range) => `共${total}條`,
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
            /> : null }
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          width={800}
          footer={false}
          onCancel={e=>this.closebind()}
        >
          {this.state.visible ? <RoleModalBindingAdd {...this.props} data={this.state.data} closebind={this.closebind.bind(this)} /> : null}
        </Modal>
      </div>
    );
  }
}

export default RoleModalBinding;
