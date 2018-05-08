import React, { Component } from   'react';;
import { Modal } from 'antd';
import RoleModalAdd from './module-modal-add.js';
import RoleModalModify from './module-modal-modify.js';
import RoleModalPower from './module-modal-power.js';
class ModuleModal extends Component {
  getContent = (type)=>{
    switch(type){
      case 'add' :
        return <RoleModalAdd {...this.props}/>;
      case 'modify' :
        return <RoleModalModify {...this.props}/>;
      case 'power' :
        return <RoleModalPower {...this.props}/>;
      default:
        return null;
    }
  }
  render() {
    const { visible,type } = this.props.modalInfo;
    let width;
    if(type=='binding'){
      width = 1000;
    }
    return (
      <Modal
        visible={visible}
        footer={false}
        onCancel={()=>this.props.closeModal()}
        maskClosable={false}
        width={width}
      >
        { visible ? this.getContent(type) : null }
      </Modal>
    );
  }
}

export default ModuleModal;


