import React, { Component } from   'react';;

import { Row, Col, Button, Table, Input } from 'antd';
const la = $q.i18n;
const Search = Input.Search;

class RoleModalBindingAdd extends Component {
  state = {
    pagesize: 10,
    selectedRowKeys: [],
    search: '',
    searchvalue: '',
  }
  componentDidMount() {
    this.getDate(1);
  }
  reset = () => {
    this.setState({
      search: '',
      searchvalue: '',
    },()=>{
      this.getDate(1);
    });
  }
  getDate = (page) => {
    //http://10.110.200.103/services/security/user/list/1/10?Q=id_L_NI=
    let listurl = $q.url + `/security/user/list/${page}/${this.state.pagesize}?Q=id_L_NI=${this.props.data}`;
    if (this.state.search) {
      listurl += ('&Q=acount_LK=' + this.state.search);
    }
    $q.get(listurl, bindlist => {
      this.setState({
        bindlist,
      });
    });
  }
  submit = () => {
    //http://10.110.200.103/services/security/role/roleUser/1
    $q.post($q.url + '/security/role/roleUser/' + this.props.modalInfo.id, JSON.stringify(this.state.selectedRowKeys), () => {
      this.props.closebind(true);
    }, xhr => {
      this.props.closebind(true);
      $q.errorAction(xhr);
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
      title: la['zh'][lk],//'帳戶'
      dataIndex: 'acount',
    }, {
      title: la['yx'][lk],//'Email',
      dataIndex: 'businessEmail',
    }, {
      title: la['xm'][lk],// '姓名',
      dataIndex: 'lastname',
    }];
    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col className="bordern">{la['role07'][lk]/* 待選擇用戶 */}</Col>
          <Col className="bordern">
            <Search
              value={this.state.searchvalue}
              onChange={(e) => {
                this.setState({
                  searchvalue: e.target.value,
                });
              }}
              placeholder={la['zh'][lk]}
              style={{ width: 200 }}
              onSearch={search => this.setState({ search }, () => {
                this.getDate(1);
              })}
            />
            <Button className="but-tab" style={{ marginLeft: 8 }} onClick={()=>this.setState({ search:this.state.searchvalue }, () => {
              this.getDate(1);
            })}>{la['cx'][lk]/* 重置 */}</Button>
            <Button className="but-tab" style={{ marginLeft: 8 }} onClick={this.reset}>{la['cz'][lk]/* 重置 */}</Button>

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
            /> : null}
          </Col>
          <Col style={{ textAlign: 'right' }}>
            <Button className="but-tab" style={{ marginRight: 10 }} onClick={() => this.props.closebind()}>{la['qx'][lk]/* 取消 */}</Button>
            <Button className="but-tab" type="primary" onClick={this.submit}>{la['qr'][lk]/* 確認選擇 */}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RoleModalBindingAdd;
