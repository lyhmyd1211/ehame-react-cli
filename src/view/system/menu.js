import React, { Component } from   'react';;
import { Button, Input, Form, message, Popconfirm, Tree, InputNumber, Checkbox } from 'antd';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
import './org.less';


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
  getTreeData() {
    let that = this;
    $q.get($q.url + '/menu/list', data => {
      that.setState({ data });
    });
  }
  add = () => {
    let that = this;
    that.refs.addinfoform.setFieldsValue({
      name: '',
      url: '',
      moduleCode: '',
      className: '',
      iconName: '',
      anchor: '',
      sn: '',
      publish: false,
    });
    this.setState({ editstatus: 'add' });
  }

  delete = () => {
    const lk = 0;
    let that = this;
    const { current } = this.state;
    if (current) {
      //调用接口删除数据
      !!current && $q.del($q.url + '/menu/single/' + current, {}, res => {
      }, xhr => {
        if (xhr.status === 204) {
          that.getTreeData();
          message.success(la['czcg'][lk]/* '操作成功！' */, 3);
        }
        $q.errorAction(xhr);
      });
    }
  }
  onSelect = (selectedKeys, info) => {
    let that = this;
    let current = selectedKeys[0];
    //查询重置表单数据
    !!current && $q.get($q.url + '/menu/single/' + current, res => {
      if (res) {
        that.refs.addinfoform.setFieldsValue({
          name: res.name,
          url: res.url,
          moduleCode: res.moduleCode,
          className: res.className,
          iconName: res.iconNamename,
          anchor: res.anchor,
          sn: res.sn,
          publish: res.publish,
        });
      }
    });
    this.setState({ current, editstatus: 'edit', parentId: info.node ? info.node.props.parentId : this.state.parentId });
  }
  getTree = (data, id) => {
    const arr = [];
    data.map(v => {
      if (v.parentId === id) {
        const temp = this.getTree(data, v.id);
        arr.push(
          temp.length === 0 ?
            <TreeNode title={v.name} key={v.id} parentId={v.parentId} /> :
            <TreeNode title={v.name} key={v.id} parentId={v.parentId}>
              {temp}
            </TreeNode>
        );
      }
    });
    return arr;
  }
  render() {
    const { current, parentId, data, editstatus } = this.state;
    const lk = 0;
    return (

      <div className={`sys-org clearfix ${(!!current && current !== 0 && parentId !== 0 || editstatus === 'add') ? 'sys-org-edit' : ''}`}>
        <div className="org-nav">
          <div className="org-nav-oper">
            {<Button type="primary" onClick={this.add} disabled={current === 0}>{la['xz'][lk]/* 新增 */}</Button>}
            {<Popconfirm title={la['qrsc'][lk]/* "您確定要刪除該機構？" */} onConfirm={this.delete} okText={la['qr'][lk]/* "是" */} cancelText={la['qx'][lk]/* "否" */}>
              <Button type="" disabled={current === 0 || parentId === 0 || !current}>{la['sc'][lk]/* 刪除 */}</Button>
            </Popconfirm>}
          </div>
          <div className="org-nav-menu">
            <Tree
              showLine
              style={{ width: 300 }}
              value={this.state.value}
              onSelect={this.onSelect}
              defaultExpandedKeys={['1']}
            >
              {this.getTree(data, 0)}
            </Tree>

          </div>
        </div>
        <div className={'org-operdetail'}>
          <Addinfoform {...this.props} ref="addinfoform" />
          <div className="edit-btns">
            <Button type="primary" onClick={this.handleSubmit} className="org-submit-btn">{la['qr'][lk]/* 確定 */}</Button>
            <Button type="" onClick={this.onSelect.bind(this, [current])}>{la['cz'][lk]/* 重置 */}</Button>
          </div>
        </div>
      </div>

    );
  }
  handleSubmit = () => {
    const lk = 0;
    let { current, editstatus, parentId } = this.state;
    this.refs.addinfoform.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (editstatus === 'edit') {
          $q.put($q.url + '/menu/single', JSON.stringify({
            id: current,
            parentId,
            name: values.name,
            url: values.url,
            moduleCode: values.moduleCode,
            className: values.className,
            iconName: values.iconNamename,
            anchor: values.anchor,
            sn: values.sn,
            publish: values.publish,
          }), data => {
            message.success(la['czcg'][lk]/* '操作成功！' */);
            this.getTreeData();
          });
        } else if (editstatus === 'add') {
          $q.post($q.url + '/menu/single', JSON.stringify({
            parentId: current,
            name: values.name,
            url: values.url,
            moduleCode: values.moduleCode,
            className: values.className,
            iconName: values.iconNamename,
            anchor: values.anchor,
            sn: values.sn,
            publish: values.publish,
          }), data => {
            message.success(la['czcg'][lk]/* '操作成功！' */);
            this.getTreeData();
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
    const lk = 0;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const formItemLayout2 = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16, offset: 8,
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label={la['mc'][lk]/* "名稱" */}
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message:  la['cxwbtx'][lk]/* '請輸入欄目名稱' */ ,
            }],
          })(
            <Input className="input-comm" placeholder={la['mc'][lk]/* "名稱" */} />
            )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="URL"
          hasFeedback
        >
          {getFieldDecorator('url')(
            <Input className="input-comm" placeholder="URL" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['quanxm'][lk]/* "許可權碼" */}
          hasFeedback
        >
          {getFieldDecorator('moduleCode')(
            <Input className="input-comm" placeholder={la['quanxm'][lk]/* "許可權碼" */} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Class"
          hasFeedback
        >
          {getFieldDecorator('className')(
            <Input className="input-comm" placeholder="class" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Icon"
          hasFeedback
        >
          {getFieldDecorator('iconName')(
            <Input className="input-comm" placeholder="icon name" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['maod'][lk]/* "錨點" */}
          hasFeedback
        >
          {getFieldDecorator('anchor')(
            <Input className="input-comm" placeholder={la['maod'][lk]/* "錨點" */} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={la['paixh'][lk]/* "排序號" */}
        >
          {getFieldDecorator('sn')(
            <Input className="input-comm"Number min={0} />
          )}
        </FormItem>
        <FormItem {...formItemLayout2} style={{ marginBottom: 8 }}>
          {getFieldDecorator('publish', {
            valuePropName: 'checked',
          })(
            <Checkbox>{la['shiffb'][lk]/* 是否發佈 */}</Checkbox>
            )}
        </FormItem>
      </Form>
    );
  }
}
const Addinfoform = Form.create({})(Infoform);
