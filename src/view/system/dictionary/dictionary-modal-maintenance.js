import React, { Component } from   'react';;
const la = $q.i18n;
import Config from '../../content/ruleConfig';
import { Row, Col, Button, Tree, Card, Form, Input, Popconfirm, message } from 'antd';
const TreeNode = Tree.TreeNode;

class DictionaryModalMaintenance extends Component {
  state = {
    rootdata: false,
    alldata: false,
    selectdata: false,
    selectedKeys: [],
    type: false,
  }
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    $q.get($q.url + '/lookup/single/' + this.props.modalInfo.id, rootdata => {
      this.setState({ rootdata });
      $q.get($q.url + '/lookup/list?Q=groupCode_EQ=' + rootdata.groupCode, alldata => {
        this.setState({ alldata });
      });
    });
    if (this.state.selectedKeys.length === 1) {
      $q.get($q.url + '/lookup/single/' + this.state.selectedKeys[0], selectdata => {
        this.setState({ selectdata });
      });
    }
  }
  select = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      this.setState({ selectedKeys, type: '1' });
      //http://10.110.200.103/services/lookup/single/89
      $q.get($q.url + '/lookup/single/' + selectedKeys[0], selectdata => {
        this.setState({ selectdata });
      });
    }
  }
  getTree = (data, id) => {
    const arr = [];
    data.map(v => {
      if (v.parentId === id) {
        const temp = this.getTree(data, v.id);
        arr.push(
          temp.length === 0 ?
            <TreeNode title={v.desp} key={v.id} /> :
            <TreeNode title={v.desp} key={v.id}>
              {temp}
            </TreeNode>
        );
      }
    });
    return arr;
  }
  delete = () => {
    const data = this.state.alldata;
    const id = this.state.selectdata.id; //parentId
    const arr2 = [id];
    arr2.push(...this.getallid(data, id));
    //http://10.110.200.103/services/lookup/batch/98,99
    $q.del($q.url + '/lookup/batch/' + arr2, '', () => {
      this.getData();
    }, xhr => {
      this.getData();
      $q.errorAction(xhr);
    });
  }
  add = () => {
    this.setState({
      type: '0',
    });
  }
  getallid = (data, id) => {
    const arr = [];
    data.map(v => {
      if (v.parentId === id) {
        arr.push(v.id);
        arr.push(...this.getallid(data, v.id));
      }
    });
    return arr;
  }
  render() {
    const { selectdata, rootdata, type } = this.state;
    const AForm = Form.create()(AddForm);
    let disabled = true;
    if (rootdata && rootdata.type === '0') {
      disabled = selectdata.parentId === rootdata.id || !selectdata;
    } else {
      disabled = !selectdata;
    }
    const lk = 0;
    const powers = this.props.powers;
    return (
      <div>
        <h2 style={{ marginBottom: 10 }}>{la['zilwh'][lk]/* 資料維護 */}</h2>
        <Row>
          <Button className="but-tab" disabled={(powers && (!powers['10003.10301.001'])) || disabled} type="primary" onClick={this.add}>{la['xz'][lk]/* 新增 */}</Button>
          <Popconfirm title={la['qrsc'][lk]/* "確定要刪除當前節點嗎？" */} onConfirm={this.delete} okText={la['qr'][lk]/* "是" */} cancelText={la['qx'][lk]/* "否" */}>
            <Button className="but-tab" disabled={(powers && (!powers['10003.10301.004'])) || selectdata.id === rootdata.id || !selectdata} style={{ marginLeft: 10 }}>{la['sc'][lk]/* 刪除 */}</Button>
          </Popconfirm>
          <Button className="but-tab" style={{ marginLeft: 10 }} onClick={e => this.props.closeModal()}>{la['fh'][lk]/* 返回 */}</Button>
          <br />
          <br />
        </Row>
        <Row gutter={12}>
          <Col span="12">
            <Card style={{ minHeight: 500 }} >
              {
                this.state.alldata ? <Tree
                  showLine
                  onSelect={this.select}
                  selectedKeys={this.state.selectedKeys}
                >
                  {this.getTree(this.state.alldata, 0)}
                </Tree> : null
              }
            </Card>
          </Col>
          <Col span="12">
            <Card style={{ minHeight: 500 }} >
              {(selectdata && (selectdata.id !== rootdata.id) || type === '0') ? <AForm lk={lk} getData={this.getData.bind(this)} selectdata={selectdata} type={type} rootdata={rootdata} /> : null}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default DictionaryModalMaintenance;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
};


class AddForm extends Component {
  handleSubmit = (e) => {
    const lk = 0;
    e.preventDefault();//取消默认的行为
    this.props.form.validateFields((err, value) => {
      if (!err) {
        //http://10.110.200.103/services/lookup/single
        value.groupCode = this.props.selectdata.groupCode;
        let ajax;
        if (this.props.type === '0') {
          value.id = '';
          value.parentId = this.props.selectdata.id;
          ajax = 'post';
        } else {
          value.parentId = this.props.selectdata.parentId;
          value.id = this.props.selectdata.id;
          ajax = 'put';
        }
        $q.get(`${$q.url}/lookup/list?Q=code_EQ=${value.code}&Q=groupCode_EQ=${this.props.rootdata.groupCode}`, (data) => {
          if (data.length === 1 && this.props.type === '0') {
            message.error(la['ziliaobianmachongfu'][lk]);
          } else if (data.length === 0 || (data.length === 1 && data['0'].id === value.id)) {
            $q[ajax]($q.url + '/lookup/single', JSON.stringify(value), data => {
              if (data) {
                message.success(la['czcg'][lk]);
                this.props.getData();
              }
            }, () => { }, true);
          } else {
            message.error(la['ziliaobianmachongfu'][lk]);
          }
        });

      }
    });
  }

  render() {
    const {
      onInput,
      onMinInput,
      onTextAreaLarge,
      onTextAreaSmall,
    } = Config;
    const lk = 0;
    const { getFieldDecorator } = this.props.form;
    let obj = this.props.selectdata;
    if (this.props.type === '0') {
      obj = {};
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label={la['zillxmc'][lk]/* "資料類型" */}
          {...formItemLayout}
        >
          <Input className="input-comm" value={this.props.rootdata.desp} disabled />

        </FormItem>
        <FormItem
          label={la['shujmc'][lk]/* "資料名稱" */}
          {...formItemLayout}
        >
          {getFieldDecorator('desp', {
            rules: [{
              required: true, message: la['cxwbtx'][lk]+',最长40个字符！',max:40/* '請輸入資料名稱!' */,
            }],
            initialValue: obj.desp,
          })(
            <Input className="input-comm" onInput={onInput}/>
            )}
        </FormItem>
        <FormItem
          label={la['shujbm'][lk]/* "資料編碼" */}
          {...formItemLayout}
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true, message: la['cxwbtx'][lk]+',最长40个字符！',max:40/* '請輸入資料名稱!' */,
            }],
            initialValue: obj.code,
          })(
            <Input className="input-comm" onInput={onMinInput}/>
            )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          <Button className="but-tab" type="primary" htmlType="submit" style={{ marginRight: 20 }}>{la['bc'][lk]/* 保存 */}</Button>
        </FormItem>
      </Form>
    );
  }
}
