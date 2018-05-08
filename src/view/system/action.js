import React, { Component } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Modal,
  Pagination,
  Spin,
  message
} from 'antd';
import {
  Link
} from 'react-router';
import {
    getService,
    postService,
} from './../content/myFetch.js';
import API_PREFIX from './../content/apiprefix';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const formItemLayout = {
  labelCol: {
      span: 11
  },
  wrapperCol: {
      span: 12
  },
};


export default class Action extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSi: [],     //表格内容
      pageSi: 1,      //当前页数
      pageSizeSi: 10, //当前一页显示的条数
      lengthSi: 0,    //当前表格内容的总数
      valueSi: {},    //查询的内容
    }
  }
  componentWillMount() {
    this.getDataSi(1,10);
  }

  //分页
  getDataSi = (page, pageSize) => {
    let values = this.state.valueSi;
    let queryFilter = '';
    console.log('valueSi',values)
    if(typeof(values.operDesc)==="undefined"){
      values.operDesc = "";
    }
    if(typeof(values.createUserIdAcount)==="undefined"){
      values.createUserIdAcount = "";
    }
    if(typeof(values.ipAddress)==="undefined"){
      values.ipAddress = "";
    }
    if(typeof(values.createDate)==="undefined"){
      values['startTime'] = "";
      values['endTime'] = "";
    }else{
      if (typeof(values.createDate[1])!=="undefined") {
        values['startTime'] = values.createDate[0].format('YYYY-MM-DD HH:mm:ss');
        values['endTime'] = values.createDate[1].format('YYYY-MM-DD HH:mm:ss');
      }
    }

    let queryFilter1 = 'Q=operDesc_S_LK='+values.operDesc
    +'&Q=ipAddress_S_LK='+values.ipAddress          
    +'&Q=createUserId_S_EQ='+values.createUserIdAcount
    +'&Q=createDate_D_GE='+values.startTime
    +'&Q=createDate_D_LE='+values.endTime;   
    getService(API_PREFIX + `/services/security/action/list/${page}/${pageSize}?${queryFilter1}`, (result) => {
        this.setState({
          dataSi: result.data,
          lengthSi: result.length,
          pageSi: result.page,
          pageSizeSi: result.pageSize,
      });        
    });
  }
  pageChangeSi = (page, pageSize) => {
    this.getDataSi(page,pageSize);
  }
  onShowSizeChangeSi = (page, pageSize) => {
    this.getDataSi(1,pageSize);
  }
  onQueryDataSi = (value) => {
    this.setState({
      dataSi:value.data,
      lengthSi: value.length,
      pageSi: 1,
      pageSizeSi: 10,
    })
  }
  getQueryContentSi(value){
    this.setState({
      valueSi: value,
      pageSi: 1,
      pageSizeSi: 10,
    })
  }
  render() {
    const { dataSi, pageSi, pageSizeSi, lengthSi } = this.state;
    const QueryA = Form.create()(QueryAction);
    let paginationSi = {
      total: lengthSi,
      showSizeChanger: true,
      pageSize: pageSizeSi,
      current: pageSi,
      onShowSizeChange: this.onShowSizeChangeSi,
      onChange: this.pageChangeSi,
    };
    let dataSourceSi = [];
    dataSi && dataSi.map(function(val,index){
      let item = {
        key: index,
      }
      dataSourceSi.push({...val,...item});
    });
    let columnSi = [{
      title: '操作用户',
      dataIndex: 'createUserIdAcount',
      key:'createUserIdAcount',
    }, {
      title: '操作者角色',
      dataIndex: 'createUserIdLastName',
      key: 'createUserIdLastName',
    }, {
      title: '操作',
      dataIndex: 'operDesc',
      key:'operDesc',
    }, {
       title: 'IP',
       dataIndex: 'ipAddress',
       key:'ipAddress',  
    }, {
      title: '操作时间',
      dataIndex: 'createDate',
      key: 'createDate',
    }];
    return (
      <div>
        <Row gutter={6}>
          <QueryA 
            valueSi={this.state.valueSi}
            onQueryDataSi={this.onQueryDataSi.bind(this)} 
            getQueryContentSi={this.getQueryContentSi.bind(this)}
          />
        </Row>
        <div className="table-comm">
        <Table dataSource={dataSourceSi} columns={columnSi} pagination={paginationSi} bordered/>
        </div>
      </div>
    );
  }
}

class QueryAction extends Component {
    constructor(props) {
      super(props);
      this.state = {
        resetData : props.valueSi,
        userInfo: [],
      }
    }
    componentWillMount() {
        $q.get($q.url + '/security/user/list/1/600', data => {
          this.setState({
            userInfo: data.data,
          });
        });
    }
    handleReset = () => {
      // 重置刷新这个组件
      this.setState({
        resetData:'',
      })
      this.props.form.resetFields();
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }        
        const values = {
          ...fieldsValue,
        };
        // console.log('content',values);
        if(typeof(values.operDesc)==="undefined"){
          values.operDesc = "";
        }
        if(typeof(values.createUserIdAcount)==="undefined"){
          values.createUserIdAcount = "";
        }
        if(typeof(values.ipAddress)==="undefined"){
          values.ipAddress = "";
        }
        if(typeof(values.createDate)==="undefined"){
          values['startTime'] = "";
          values['endTime'] = "";
        }else{
          if (typeof(values.createDate[1])!=="undefined") {
            values['startTime'] = values.createDate[0].format('YYYY-MM-DD HH:mm:ss');
            values['endTime'] = values.createDate[1].format('YYYY-MM-DD HH:mm:ss');
          }
        }

        let queryFilter = 'Q=operDesc_S_LK='+values.operDesc
        +'&Q=ipAddress_S_LK='+values.ipAddress          
        +'&Q=createUserId_S_EQ='+values.createUserIdAcount
        +'&Q=createDate_D_GE='+values.startTime
        +'&Q=createDate_D_LE='+values.endTime             
        getService(API_PREFIX + `/services/security/action/list/1/10?${queryFilter}`, data => {
            this.props.onQueryDataSi(data);  
            this.props.getQueryContentSi(values);          
          });
      });
    }
    render() { 
      const { getFieldDecorator } = this.props.form;
      const { operDesc, ipAddress,  createUserIdAcount } = this.state.resetData;
      const formItemLayout = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 12
        },
      };
      const formItemLayout1 = {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 14
        },
      };
      const fstyle = {
        width: '100%',
      };
      const children = [];
      children.push(
          this.state.userInfo&&this.state.userInfo.map((item,index)=>{
              return (
                  <Option key={index} value={item.id}>{item.acount}</Option>
              );
          })
      );
      return (
        <div>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                    label="操作用户："
                >
                  {getFieldDecorator('createUserIdAcount',{initialValue:createUserIdAcount})(
                    <Select
                        className="select-comm"
                        showSearch
                        style={{width:"120px",height:"38px"}}         
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {children}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem
                  {...formItemLayout}
                    label="操作："
                >
                  {getFieldDecorator('operDesc',{initialValue:operDesc})(
                    <Input className="input-comm" style={fstyle}/>
                  )}
                </FormItem>
              </Col>                            
              <Col span={5}>
                <FormItem
                  {...formItemLayout}
                    label="IP："
                >
                  {getFieldDecorator('ipAddress',{initialValue:ipAddress})(
                    <Input className="input-comm" style={fstyle}/>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout1}
                    label="操作时间："
                >
                  {getFieldDecorator('createDate')(
                    <RangePicker 
                      className="calendar-comm"
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{width:'280px'}}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>              
              <Col span={3} offset={18}>
                <FormItem >
                  <Button className="but-tab" type="primary" htmlType="submit" size="large" >
                    查询
                  </Button>
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem >
                  <Button className="but-tab" type="primary" htmlType="reset" onClick={this.handleReset.bind(this)}>
                    重置
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

        </div>
      )
    }
}