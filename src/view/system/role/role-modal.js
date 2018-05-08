import React, { Component } from 'react';;
import { Modal } from 'antd';
import RoleModalAdd from './role-modal-add.js';
import RoleModalModify from './role-modal-modify.js';
import RoleModalPower from './role-modal-power.js';
import RoleModalBinding from './role-modal-binding.js';
class RoleModal extends Component {
  getContent = (type) => {
    switch (type) {
      case 'add':
        return <RoleModalAdd {...this.props} />;
      case 'modify':
        return <RoleModalModify {...this.props} />;
      case 'power':
        return <RoleModalPower {...this.props} />;
      case 'binding':
        return <RoleModalBinding {...this.props} />;
      default:
        return null;
    }
  }
  render() {
    const { visible, type } = this.props.modalInfo;
    let width;
    if (type == 'binding') {
      width = 1000;
    }
    const getTitle = (type) => {
      switch (type) {
        case 'add':
          return '用户角色新增';
        case 'modify':
          return '用户角色修改';
        case 'power':
          return '用户角色设置';
        case 'binding':
          return '用户角色绑定';
        default:
          return '用户角色';
      }
    };
    return (
      <Modal
        title={`${getTitle(type)}`}
        className="modal-comm"
        visible={visible}
        footer={false}
        onCancel={() => this.props.closeModal()}
        maskClosable={false}
      >
        {visible ? this.getContent(type) : null}
      </Modal>
    );
  }
}

export default RoleModal;


