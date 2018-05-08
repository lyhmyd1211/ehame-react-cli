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
  state => ({ role: state.system.role}),
  mapDispatchToProps
)
class RoleModalPower extends Component {
  state = {
    check: false,
    scanall:[],
    checkPartments:[],
  }
  componentWillMount() {


    //获取列表
    if (this.props.role.scanall.length === 0) {
      $q.get($q.url + '/security/org/list/', data => {
          let  list = [];
          let node = new Object();
          data.map(item=>{
            if (item.id==1) {
              node.orgName = item.orgName;
              node.orgCode = item.orgCode;
              node.id = item.id+',';
              node.pId = item.pId;
              item.treeId = item.id+',';
              this.loadNode(data,item,list);
            }
          });
         list.push(node);
         this.setState({ scanall: list});
      });
    }

    //获取选中项
    $q.get($q.url + '/moduledepartment/getModuleDepartmentById/' + this.props.modalInfo.id, check => {
      this.setState({
        check,
      });
    });
  }
    //获取子节点
    getChildren(list,pid){
      let result =[];
     list.map(item=>{
      if (item.pId==pid) {
        result.push(item);
      }
     });
     return result;
    }
    //构造树节点
     loadNode(list,pNode,result)
    {
        let vDtbl=this.getChildren(list,pNode.id);
        if(vDtbl!=null)
        {
            for (let i = 0; i < vDtbl.length; i++) {
                    vDtbl[i]['treeId'] = pNode.treeId+vDtbl[i]['id']+',';
                    vDtbl[i]['treePid'] = pNode.treeId;
                    let temp = new Object();
                    temp.orgName = vDtbl[i]['orgName'];
                    temp.orgCode=vDtbl[i]['orgCode'];
                    temp.id=vDtbl[i]['treeId'];
                    temp.pId=vDtbl[i]['treePid'];
                    result.push(temp);
                    if(vDtbl.length!=0)// 判断该NodeID是否存在子集
                      {
                    this.loadNode(list,vDtbl[i],result);
                      }
                    }
          }

    }
  checkedChange = (check,info) => {
    let list = [];
    info.checkedNodes.map(item=>{
    let temp = new Object();
    temp.departmentId = item.key;
    let str = item.props.title;
    temp.code = str.substring(str.indexOf('(')+1,str.indexOf(')'));
    list.push(temp);
    });

    this.setState({
      checkPartments:list,
      check:check,
    });
  }
  submit = () => {
    //http://10.110.200.103/services/security/permission/role/127
    const body = JSON.stringify(this.state.checkPartments);
    $q.post($q.url + '/moduledepartment/insertModulePermisson/' + this.props.modalInfo.id, body, (data) => {
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
      if (v.pId === id) {
        const temp = this.getTree(data, v.id);
        arr.push(
          temp.length === 0 ?
            <TreeNode title={v.orgName+'('+v.orgCode+')'} key={v.id} pId={v.pId} /> :
            <TreeNode title={v.orgName+'('+v.orgCode+')'} key={v.id} pId={v.pId}>
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
        <p> {this.props.modalInfo.desp} </p>
        {((this.state.scanall.length > 0) && (this.state.check !== false)) ? <Tree
          checkable
          checkStrictly
          defaultExpandAll
          checkedKeys= {this.state.check}
          onCheck={this.checkedChange}
        >
          {this.getTree(this.state.scanall, 0)}
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
