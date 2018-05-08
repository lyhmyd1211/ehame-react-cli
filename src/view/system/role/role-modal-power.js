import React, { Component } from   'react';;
import { Tree, Row, Button } from 'antd';
const TreeNode = Tree.TreeNode;
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
class RoleModalPower extends Component {
  state = {
    check: false,
  }
  componentWillMount() {
    //http://10.110.200.103/services/security/permission/scanall
    //获取列表
    if (this.props.role.scanall.length === 0) {
      $q.get($q.url + '/security/permission/scanall', data => {
        this.props.getSystemRoleScanall(data);
      });
    }
    //http://10.110.200.103/services/security/permission/role/127
    //获取选中项
    $q.get($q.url + '/security/permission/role/' + this.props.modalInfo.id, check => {
      this.setState({
        check,
      });
    });
  }
  checkedChange = (check) => {
    this.setState({
      check,
    });
  }
  submit = () => {
    //http://10.110.200.103/services/security/permission/role/127
    const body = JSON.stringify(this.state.check);
    $q.post($q.url + '/security/permission/role/' + this.props.modalInfo.id, body, (data) => {
      this.props.closeModal(true);
    }, (xhr) => {
      if (xhr.status === 204) {
        this.props.closeModal(true);
      }
      $q.errorAction(xhr);
    }, true);
  }
  getTree = (data, id) => {
    const arr = [];
    data.map(v => {
      if (v.parentCode == id) {
        const temp = this.getTree(data, v.code);
        arr.push(
          temp.length === 0 ?
            <TreeNode title={'(' + v.code.split('.').pop() + ')' + v.desc} key={v.code} /> :
            <TreeNode title={'(' + v.code.split('.').pop() + ')' + v.desc} key={v.code}>
              {temp}
            </TreeNode>
        );
      }
    });
    return arr;
  }
  render() {
    const lk = 0;
    return (
      <div>
        <p> {this.props.modalInfo.name} </p>
        {((this.props.role.scanall.length > 0) && (this.state.check !== false)) ? <Tree
          checkable
          checkedKeys={this.state.check}
          onCheck={this.checkedChange}
        >
          {this.getTree(this.props.role.scanall, 'Smart')}
        </Tree> : null}
        <Row>
          <Button type="primary" onClick={this.submit} style={{ marginRight: 20 }}>{la['qr'][lk]/* 确认 */}</Button>
          <Button onClick={e => this.props.closeModal()}>{la['qx'][lk]/* 取消 */}</Button>
        </Row>
      </div>
    );
  }
}

export default RoleModalPower;
