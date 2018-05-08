import React, { Component } from   'react';;
import { Button, Input, Form, message, Popconfirm, Tree } from 'antd';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
import './org.less';
import Config from '../content/ruleConfig';
import { connect } from 'react-redux';
const la = $q.i18n;

@connect(
  state => ({ lk: state.language })
)
class Organization extends Component {
  state = {
    current: null,
    data: [],
  }
  componentDidMount() {
    this.getTreeData();
  }
  //获取树形控件数据
  getTreeData() {
    $q.get($q.url + '/security/org/list', data => {
      this.setState({ data });
    });
  }
  add = () => {
    let that = this;
    that.refs.addinfoform.setFieldsValue({
      orgName: '',
      filed1: '',
      orgCode: '',
      orgNote: '',
    });
    this.setState({ editstatus: 'add' });
  }

  delete = () => {
    let that = this;
    const lk = 0;
    const { current } = this.state;
    if (current) {
      //调用接口删除数据
      !!current && $q.del($q.url + '/security/org/single/' + current, {}, res => {
        // }, xhr => {
          if (res.code === 1) {
            $q.get($q.url + '/security/org/list', data => {
              this.setState({ data });
            });
            message.success(la['czcg'][lk]/* '操作成功！' */, 3);
          }
          $q.get($q.url + '/security/org/list', data => {
            this.setState({ data });
          });
        }
      );
    }
    // console.log('123')
    // this.getTreeData();
    // that.getTreeData();
    // getTreeData();
  }
  onSelect = (selectedKeys, info) => {
    let that = this;
    let current = selectedKeys[0];
    //查询重置表单数据
    !!current && $q.get($q.url + '/security/org/single/' + current, res => {
      if (res) {
        that.refs.addinfoform.setFieldsValue({
          orgName: res.orgName,
          filed1: res.filed1,
          orgCode: res.orgCode,
          orgNote: res.orgNote,
        });
      }
    });
    this.setState({ current, editstatus: 'edit', pId: info.node ? info.node.props.pId : this.state.pId });
  }
  getTree = (data, id) => {
    const arr = [];
    data.map(v => {
      if (v.pId === id) {
        const temp = this.getTree(data, v.id);
        arr.push(
          temp.length === 0 ?
            <TreeNode title={v.orgName +'('+v.id+')'} key={v.id} pId={v.pId} /> :
            <TreeNode title={v.orgName +'('+v.id+')'} key={v.id} pId={v.pId}>
              {temp}
            </TreeNode>
        );
      }
    });
    return arr;
  }
  render() {
    const lk = 0;
console.log('data~~~',this.state.data);
    return (

      <div className={`sys-org clearfix ${this.state.current ? 'sys-org-edit' : ''}`}>
        <div className="org-nav">
          <div className="org-nav-oper">
            <Button type="primary" onClick={this.add} disabled={!this.state.current}>{la['xz'][lk]/* 新增 */}</Button>
            <Popconfirm title={la['qrsc'][lk]/* "您確定要刪除該機構？" */} onConfirm={this.delete} okText={la['qr'][lk]/* "是" */} cancelText={la['qx'][lk]/* "否" */}>
              <Button type="" disabled={!this.state.current}>{la['sc'][lk]/* 刪除 */}</Button>
            </Popconfirm>
          </div>
          <div className="org-nav-menu">

            <Tree
              showLine
              style={{ width: 300 }}
              value={this.state.value}
              onSelect={this.onSelect}
              defaultExpandedKeys={['1']}
            >
              {this.getTree(this.state.data, 0)}
            </Tree>

          </div>
        </div>
        <div className={'org-operdetail'}>
          <Addinfoform {...this.props} ref="addinfoform" />
          <div className="edit-btns">
            <Button type="primary" onClick={this.handleSubmit} className="org-submit-btn">{la['qr'][lk]/* 確定 */}</Button>
            <Button type="" onClick={this.onSelect.bind(this, [this.state.current])}>{la['cz'][lk]/* 重置 */}</Button>
          </div>
        </div>
      </div>

    );
  }
  handleSubmit = () => {
    let that = this;
    const lk = 0;

    let { current, editstatus, pId } = this.state;
    this.refs.addinfoform.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (editstatus === 'edit') {
          $q.put($q.url + '/security/org/single', JSON.stringify({
            filed1: values.filed1,
            id: current,
            orgCode: values.orgCode,
            orgName: values.orgName,
            orgNote: values.orgNote,
            pId,
          }), res => {
            //重置树形控件
            message.success(la['czcg'][lk]/* '操作成功！' */);
            that.getTreeData();
          });
        } else if (editstatus === 'add') {
          $q.post($q.url + '/security/org/single', JSON.stringify({
            filed1: values.filed1,
            id: '',
            orgCode: values.orgCode,
            orgName: values.orgName,
            orgNote: values.orgNote,
            pId: current,
          }), res => {
            //重置树形控件
            message.success(la['czcg'][lk]/* '操作成功！' */);
            that.getTreeData();
          });
        }
      }
    });
  }
  reset = () => {
    this.props.form.resetFields();
  }
}

export default Organization;
class Infoform extends Component {

  render() {
    const {
      inputConfig,
      textAreaConfigLarge,
      selectConfig,
      inputMaxConfig,
      textAreaMaxConfig,
      onInput,
      onMinInput,
      onTextAreaLarge,
      onTextAreaSmall,
    } = Config;
    const { getFieldDecorator } = this.props.form;
    const lk = 0;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label={la['zzjg'][lk]/* "機構名稱" */}
          hasFeedback
        >
          {getFieldDecorator('orgName', {
            rules: [{
              required: true, message:"*请输入组织机构,最长32个字符！",max:32 /* 此项为必填项！ */ ,
            }],
          })(
            <Input className="input-comm" placeholder={la['zzjg'][lk]/* "請輸入機構名稱（必填）" */} onInput={onInput} />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['jianc'][lk]/* "機構簡稱" */}
          hasFeedback
        >
          {getFieldDecorator('filed1', {
            rules: [{
              message:"*最长20个字符！",max:20  ,
            }],
          })(
            <Input className="input-comm" placeholder={la['jianc'][lk]/* "機構簡稱" */} onInput={onMinInput} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['bianh'][lk]/* "機構編號" */}
          hasFeedback
        >
          {getFieldDecorator('orgCode', {
            rules: [{
              required: true, message:"*请输入编号,最长20个字符！",max:20 /* 此项为必填项！ */,
            }],
          })(
            <Input className="input-comm" placeholder={la['bianh'][lk]/* "機構編號" */} onInput={onMinInput} />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['beiz'][lk]/* "備註" */}
          hasFeedback
        >
          {getFieldDecorator('orgNote', {
            rules: [{
              message:"*最长200个字符！",max:200 /* 此项为必填项！ */ ,
            }],
          })(
            <Input className="input-comm" placeholder={la['beiz'][lk]/* "備註" */} type="textarea" rows={3}  onInput={onTextAreaSmall}/>
          )}
        </FormItem>
      </Form>
    );
  }
}
const Addinfoform = Form.create({})(Infoform);


