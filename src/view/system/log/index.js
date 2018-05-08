import React, { Component } from   'react';;
import { Form, Row, Col, Input, Button, Table, Modal, DatePicker } from 'antd';
const FormItem = Form.Item;
const i18nLanguage = $q.i18n;

class AdvancedSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
    };
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
  onChangeDate = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (value) => {
    this.onChangeDate('startValue', value);
  }
  onEndChange = (value) => {
    this.onChangeDate('endValue', value);
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  componentDidMount() {
    this.handleSearch();
  }
  handleSearch = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values['startDate'] = values['startDate'] ? values['startDate'].format('YYYY-MM-DD') : null;
      values['endDate'] = values['endDate'] ? values['endDate'].format('YYYY-MM-DD') : null;
      this.props.callbackParent(values,1);
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      startValue: null,
      endValue: null,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const lk = 0;
    return (
      <Form
        layout="inline"
        onSubmit={this.handleSearch}
      >
        <FormItem
          label={i18nLanguage['commonStartDate'][lk]}
        >
          {getFieldDecorator('startDate',{initialValue: this.state.startValue})(
            <DatePicker
              disabledDate={this.disabledStartDate}
              onChange={this.onStartChange}
              placeholder={i18nLanguage['commonStartDateMsg'][lk]}
            />
          )}
        </FormItem>
        <FormItem
          label={i18nLanguage['commonEndDate'][lk]}
        >
          {getFieldDecorator('endDate',{initialValue: this.state.endValue})(
            <DatePicker
              disabledDate={this.disabledEndDate}
              onChange={this.onEndChange}
              placeholder={i18nLanguage['commonEndDateMsg'][lk]} />
          )}
        </FormItem>
        {/* <FormItem label={i18nLanguage['operCode'][lk]}>
          {getFieldDecorator('operCode')(
            <Input/>
          )}
        </FormItem> */}
        <FormItem label={i18nLanguage['operDesc'][lk]}>
          {getFieldDecorator('operDesc')(
            <Input/>
          )}
        </FormItem>
        {/* <FormItem label={i18nLanguage['resCode'][lk]}>
          {getFieldDecorator('resCode')(
            <Input/>
          )}
        </FormItem>
        <FormItem label={i18nLanguage['resDesc'][lk]}>
          {getFieldDecorator('resDesc')(
            <Input/>
          )}
        </FormItem>
        <FormItem label={i18nLanguage['methodName'][lk]}>
          {getFieldDecorator('methodName')(
            <Input/>
          )}
        </FormItem> */}
        <FormItem label={i18nLanguage['createUserIdLastName'][lk]}>
          {getFieldDecorator('createUserIdAcount')(
            <Input/>
          )}
        </FormItem>
        <FormItem label="IP">
          {getFieldDecorator('ipAddress')(
            <Input/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" >{i18nLanguage['commonSearch'][lk]}</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
            {i18nLanguage['commonReset'][lk]}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

import { connect } from 'react-redux';
@connect(
  state => ({
    lk: state.language,
  }),
)

class Log extends Component {
  state = {
    data: {},
    current: 1,
    pageSize: 10,
    loading: false,
    queryStr:{},
  };
  
  fetch = (queryStr,page) => {
    const lk = 0;
    if(queryStr){
      this.setState({
        queryStr,
      });
    }
    queryStr = queryStr || this.state.queryStr;
    let path = $q.url + '/security/action/list' + '/' + (page||this.state.current) + '/' + this.state.pageSize; ///security/action
    this.setState({ loading: true });
    if (typeof queryStr !== 'undefined') {
      path += '?';
      let k = 0;
      for (let v in queryStr) {
        if (v === 'startDate' && typeof queryStr[v] !== 'undefined' && queryStr[v] !== null) {
          if (k > 0) {
            path += '&';
          }
          path = path + 'createStartDate' + '=' + encodeURIComponent(queryStr[v]);
          k++;
        } else if (v === 'endDate' && typeof queryStr[v] !== 'undefined' && queryStr[v] !== null) {
          if (k > 0) {
            path += '&';
          }
          path = path  + 'createEndDate' + '=' + encodeURIComponent(queryStr[v]);
          k++;
        } else if (typeof queryStr[v] !== 'undefined' && queryStr[v] !== null) {
          if (k > 0) {
            path += '&';
          }
          path = path + v + '=' + encodeURIComponent(queryStr[v]);
          k++;
        }
      }
      if(k === 0) {
        path = path.substring(0,path.length-1);
      }
    }
    $q.get(path, (data) => {
      this.setState({
        loading: false,
        data: data,
        selectedRowKeys: [],
        selectedRows: [],
      });
    }, () => {
      this.setState({
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
      } ,()=> {
        return Modal.error({
          content: i18nLanguage['commonNetError'][lk],
          okText: i18nLanguage['commonOk'][lk],
        });
      });
    });
  }
  render() {
		const { data} = this.state;
    const lk = 0;
    const columns = [{
      title: i18nLanguage['commonIndex'][lk],
      dataIndex: 'index',
      className: 'center',
      render: (text, record, index) => { return index + 1; },
    }, {
      title: i18nLanguage['operDesc'][lk],
      dataIndex: 'operDesc',
      className: 'center',
    },/*  {
      title: i18nLanguage['methodName'][lk],
      dataIndex: 'methodName',
      className: 'center',
    }, */ {
      title: i18nLanguage['createUserIdLastName'][lk],
      dataIndex: 'createUserIdAcount',
      className: 'center',
    }, {
      title: i18nLanguage['ipAddress'][lk],
      dataIndex: 'ipAddress',
      className: 'center',
    }, {
      title: i18nLanguage['createDate'][lk],
      dataIndex: 'createDate',
      className: 'center',
    }];
    return (
      <div>
        <WrappedAdvancedSearchForm ref="queryForm" lk={lk} callbackParent={this.fetch} />
        <Row style={{ marginTop: 10 }}>
          <Col className="bordern">{i18nLanguage['operLog'][lk]}</Col>
          <Col>
            <Table columns={columns}
              rowKey={record => record.id}
              dataSource={data.data}
              pagination={{
                pageSizeOptions: $q.pagArr,
                current: data.page,
                total: data.length,
                showTotal: i18nLanguage['g*t'][lk],
                onChange: (current, pageSize) => {
                  this.setState({ current, pageSize }, () => {
                    this.fetch();
                  });
                },
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                  this.setState({ current, pageSize }, () => {
                    this.fetch();
                  });
                },
              }}
              loading={this.state.loading}
              bordered
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Log;
