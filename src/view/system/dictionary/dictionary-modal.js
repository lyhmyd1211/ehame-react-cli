import React, { Component } from 'react';;
import { Modal } from 'antd';
import DictionaryModalAdd from './dictionary-modal-add.js';
import DictionaryModalModify from './dictionary-modal-modify.js';
import DictionaryModalMaintenance from './dictionary-modal-maintenance.js';
class DictionaryModal extends Component {
  getContent = (type) => {
    switch (type) {
      case 'add':
        return <DictionaryModalAdd {...this.props} />;
      case 'modify':
        return <DictionaryModalModify {...this.props} />;
      case 'maintenance':
        return <DictionaryModalMaintenance {...this.props} />;
      default:
        return null;
    }
  }
  render() {
    const { visible, type } = this.props.modalInfo;
    let width;
    if (type === 'maintenance') {
      width = 400;
    }
    const getTitle = (type) => {
      switch (type) {
        case 'add':
          return '数据字典新增';
        case 'modify':
          return '数据字典修改';
        case 'maintenance':
          return '数据字典维护';
        default:
          return '数据字典';
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
        width={width}
      >
        {visible ? this.getContent(type) : null}
      </Modal>
    );
  }
}

export default DictionaryModal;


