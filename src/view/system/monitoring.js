import React, { Component } from 'react';
import { message, Tabs, Row, Col, Select, Card, Spin,Tooltip,Icon } from 'antd';
import echarts from 'echarts';
import {
    getService,
} from './../content/myFetch.js';
import API_PREFIX from './../content/apiprefix';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const API_PREFIXMonit = API_PREFIX+'/services/automation/server';
const  API_PREFIXOracle = API_PREFIX+'/services/automation/oracle';
const warning = require('../../styles/images/home/warning.png');
const circle = require('../../styles/images/circle.png');
const title1 = (<div><span>SGA共享池重载率：监控 SGA中共享缓存区的重载率，应该小于1％,大于1％需要加大共享池SHARED_POOL_SIZE<br/>
                        SGA共享池命中率：监控 SGA 中共享缓存区的命中率，应该大于95％,小于95％需要增加内存<br/>
                       SGA数据字典命中率：监控 SGA 中字典缓冲区的命中率应该大于90％,小于90％需要加大共享池SHARED_POOL_SIZE<br/>
                        SGA高速缓冲区命中率：高速缓冲区命中率,如果命中率低于70％，则应该加大init.ora参数中的DB_BLOCK_BUFFER的值<br/>
                       Buffer命中率：Buffer命中率很低,要增加DB_CACHE_SIZE<br/>
                       PGA命中率：PGA命中率不应该低于50%<br/>
                       回滚段争用率：回滚段争用应小于1%<br/>
                       排序操作率：Sort(disk)/Sort(memory)小于5%, 如果超过5%，增加sort_area_size的值(调整PGA)<br/></span></div>);
const title2 =(<div><span>
                         蓝色圆圈：PGA当前设置值<br/>
                         黄色圆圈：PGA估计值<br/>
                         PGA参考值：程序全局区大小<br/>
                        预估PGA超过分配的次数：如果PGA当前设置的值设置成估计值，估计PGA会出现的超过分配的次数<br/>
                        估计的高速缓存命中百分比：如果PGA当前设置的值设置成估计值时，估计的cache命中率<br/>
                        </span></div>);
const title3 =(<div><span>
                         蓝色圆圈：SGA当前设置值<br/>
                         黄色圆圈：SGA估计值<br/>
                         SGA参考值：系统全局区大小<br/>
                        估计物理读次数：估计的物理读的次数,越大越好<br/>
                        估计节省的时间百分比：估计的DB Time和当前设置的SGA的DB Time的比值<br/>
                        </span></div>);
const title4 =(<div><span>
                         蓝色圆圈：DBCache当前设置值<br/>
                         黄色圆圈：DBCache估计值<br/>
                         DBCache：数据库缓存<br/>
                         物理读的速率：物理读的速率大于1，越大越好。当不变时，系统设置值参考缓存值越小越好，避免浪费<br/>
                        </span></div>);
const title5 =(<div><span>
                         DBFileIO：监控热点数据文件（磁盘）<br/>
                        </span></div>);
const title6 =(<div><span>
                         tablespaceIO：监控表空间输入/输出<br/>
                        </span></div>);
const title7 =(<div><span>
                         SGA内存池：包含了共享池,java池,大型池,缓冲区高速缓存,缓冲区高速缓存以及其他内存池<br/>
                        </span></div>);
import './monitoring.less';
export default class Monitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeIps: [{ metric: {} }], //tabs-2
      loading: false,
        content:[],
        content1:null,
        nodeInstances:[],
        nodeInstance:'',
        estdOverallocCountData:[],
        estdPhysicalReadsData:[],
    };
    this.lineChart = {};
    this.gaugeChart = {};
    this.gaugeChart2 = {};
    this.pieChart = {};
    this.barChart = {};
    this.bar2Chart = {};
  }

  componentDidMount() {
    //tabs-2
    getService(API_PREFIXMonit + '/getAllNode', result => {
      if (result.retCode===1) {
        this.setState({
          nodeIps: result.root.object.data[0].data.result,
          nodeIp: result.root.object.data[0].data.result[0].metric.name,
        });
        this.nodeUsage(this.state.nodeIp);
      } else {
        message.error(result.msg);
      }
    });    
  }

  nodeUsage(nodeIp) {
    let that = this;
    this.nodeNetworkUsage(nodeIp);
    this.nodeMemoryUsage(nodeIp);
    this.nodeCpuUsage(nodeIp);
    this.nodeFsUsage(nodeIp);
    this.intervalNodeUsage = setInterval(() => {
      that.nodeNetworkUsage(nodeIp);
      that.nodeMemoryUsage(nodeIp);
      that.nodeCpuUsage(nodeIp);
      that.nodeFsUsage(nodeIp);
    }, 5000);
  }

    instanceUsage(nodeInstance) {
        let that = this;
        this.tableSpaceUsage(nodeInstance);
        this.sessionInfoUsage(nodeInstance);
        this.cacheHitRatio(nodeInstance);
        this.pgaTagertAdvice(nodeInstance);
        this.sgaTagertAdvice(nodeInstance);
        this.dbCacheAdvice(nodeInstance);
        this.dbFileIO(nodeInstance);
        this.tablespaceIO(nodeInstance);
        this.cachePoolUsage(nodeInstance);
        this.sgaAllot(nodeInstance);
        this.intervalInstanceUsage = setInterval(() => {
            that.tableSpaceUsage(nodeInstance);
            that.sessionInfoUsage(nodeInstance);
            this.cacheHitRatio(nodeInstance);
            this.pgaTagertAdvice(nodeInstance);
            this.sgaTagertAdvice(nodeInstance);
            this.dbCacheAdvice(nodeInstance);
            this.dbFileIO(nodeInstance);
            this.tablespaceIO(nodeInstance);
            this.cachePoolUsage(nodeInstance);
            this.sgaAllot(nodeInstance);
        }, 300000);
    }

  componentWillUnmount() {
    clearInterval(this.intervalNodeUsage);
    clearInterval(this.intervalInstanceUsage);
  }
  nodeNetworkUsage(nodeIp) {
    getService(API_PREFIXMonit + '/nodeNetworkUsage/'+nodeIp, result => {
      if (result.retCode===1) {
        let nodeName = result.root.object.name;
        let nodeNames = [nodeName + '-接收', nodeName + '-发送'];
        let series = [];
        let values = [];
        const color = ['#4D3F90', '#FDCA18', '#C50505', '#9CC98C', '#F0690a', '#029DFF', '#336633', '#990033', '#FF0033', '#CC9933'];
        //接收
        let dataReceive = [];
        let dataTransmit = [];
        result.root.object.data[0].data.result[0].values.map(item => {
          values.push(item.usage);
          dataReceive.push({
            name: item.timeInfo * 1000,
            value: [item.timeInfo * 1000, item.usage],
          });
        });
        series.push({
          name: nodeNames[0],
          type: 'line',
          showSymbol: true,
          hoverAnimation: true,
          data: dataReceive,
          itemStyle: {
            normal: {
              color: color[0],
            },
          },
        });
        //发送
        result.root.object.data[1].data.result[0].values.map(item => {
          values.push(item.usage);
          dataTransmit.push({
            name: item.timeInfo * 1000,
            value: [item.timeInfo * 1000, item.usage],
          });
        });
        series.push({
          name: nodeNames[1],
          type: 'line',
          showSymbol: true,
          hoverAnimation: true,
          data: dataTransmit,
          itemStyle: {
            normal: {
              color: color[1],
            },
          },
        });
        this.drawLineChart('nodeNetworkUsage', 'node网络状况(KB)', nodeNames, series, values);
      } else {
        message.error(result.msg);
      }
    });
  }
  nodeMemoryUsage(nodeIp) {
      let that = this;
    getService(API_PREFIXMonit + '/nodeMemoryUsage/'+nodeIp, result => {
      if (result.retCode===1) {
        let nodeNames = ['已使用', '剩余'];
        let series = [{
          name: '内存使用状况',
          type: 'pie',
          label: {
            normal: {
              show: true,
              position: 'inside',
            },
          },
          data: [
            { value: (result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage).toFixed(2), name: '已使用' },
            { value: result.root.object.data[1].data.result[0].values[0].usage, name: '剩余' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            normal: {
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)',
              },
              labelLine: { show: true },
                color:function (data) {
                    if(data.dataIndex == 1){
                        return 'rgba(52, 67, 89, 1)';
                    }else if(data.dataIndex ==0){
                        if((result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage)/result.root.object.data[0].data.result[0].values[0].usage>= 0.8){
                            let content = [];
                          content.push(<div><img className='warning-img' src={warning} /><span style={{ lineHeight:'32px'}}>内存告警</span></div>);
                            that.setState({
                                content:content,
                            })
                            return 'rgba(172, 61, 57, 1)';
                        }else if((result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage)/result.root.object.data[0].data.result[0].values[0].usage< 0.8){
                            that.setState({
                                content:null,
                            })
                            return 'rgba(239, 209, 66, 1)';
                        }
                    }
                }
            },
          },
        }];
        // 绘制图表
        this.drawPieChart('nodeMemoryUsage', '节点内存使用情况(KB)', nodeNames, series);
      } else {
        message.error(result.msg);
      }
    });
  }
  nodeFsUsage(nodeIp) {
      let that = this;
    getService(API_PREFIXMonit + '/nodeFsUsage/'+nodeIp, result => {
      if (result.retCode===1) {
        let nodeNames = ['已使用', '剩余'];
        let series = [{
          name: '文件系统使用状况',
          type: 'pie',
          label: {
            normal: {
              show: true,
              position: 'inside',
            },
          },
          data: [
            { value: result.root.object.data[1].data.result[0].values[0].usage, name: '剩余' },
            { value: (result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage).toFixed(2), name: '已使用' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            normal: {
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)',
              },
              labelLine: { show: true },
                color:function (data) {
                    if(data.dataIndex == 0){
                            return 'rgba(52, 67, 89, 1)';
                    }else if(data.dataIndex ==1){
                        if((result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage)/result.root.object.data[0].data.result[0].values[0].usage>= 0.8){
                            let content = [];
                          content.push(<div><img className='warning-img' src={warning} /><span style={{ lineHeight: '32px' }}>存储告警</span></div>);
                            that.setState({
                                content1:content,
                            })
                            return 'rgba(172, 61, 57, 1)';
                        }else if((result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage)/result.root.object.data[0].data.result[0].values[0].usage< 0.8){
                            that.setState({
                                content1:null,
                            })
                            return 'rgba(239, 209, 66, 1)';
                        }
                    }
                }
            },
          },
        }];
        // 绘制图表
        this.drawPieChart('nodeFsUsage', '节点文件系统使用情况(G)', nodeNames, series);
      } else {
        message.error(result.msg);
      }
    });
  }
  nodeCpuUsage(nodeIp) {
    getService(API_PREFIXMonit + '/nodeCpuUsage/'+nodeIp, result => {
      if (result.retCode===1) {
        let series = [];
        series.push({
          name: result.root.object.data.name,
          type: 'gauge',
          detail: { formatter: '{value}%' },
          data: [{ value: result.root.object.data[1].data.result[0].values[0].usage, name: 'CPU使用率' }],
        });
        // 绘制图表
        this.drawGaugeChart('nodeCpuUsage', 'CPU使用状况', series);
      } else {
        message.error(result.msg);
      }
    });
  }
   //表空间
    tableSpaceUsage(nodeInstance){
        getService(API_PREFIXOracle + '/tablespaceUsage/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let yAxis=[];
                series.push(
                    {
                        name:'已使用空间',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: false, position: 'insideRight'}}},
                        data:result.root.list.map(function (item,index,arr) {
                            yAxis.push(item.tablespaceName);
                            return item.usedSpace;
                        })
                    },
                );
                series.push({
                    name:'空闲空间',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: false, position: 'insideRight'}}},
                    data:result.root.list.map(function (item,index,arr) {
                        return item.freeSpace;
                    })
                });
                // 绘制图表
                this.drawBarChart('tableSpaceUsage', '表空间使用状况', yAxis,series);
            } else {
                message.error(result.retMsg);
            }
        });
    }

    //Session会话连接
    sessionInfoUsage(nodeInstance){
        getService(API_PREFIXOracle + '/sessionInfo/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let xAxis=[];
                series.push(
                    {
                        name: 'sesssion连接数',
                        type: 'bar',
                        //barWidth:'10%',
                       // barGap: '-110%',
                       // label: labelOption,
                        barCategoryGap:'20%',
                        smooth:true,
                        data: result.root.list.map(function (item,index,arr) {
                            xAxis.push(item.osuser);
                            return item.sessionCount;
                        })
                    },
                );
                // 绘制图表
                this.drawBar2Chart('sessionInfo', 'Session会话连接状况', xAxis,series);
            } else {
                message.error(result.retMsg);
            }
        });
    }
    //Cache命中率
    cacheHitRatio(nodeInstance){
        getService(API_PREFIXOracle + '/cacheHitRatio/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let indicator=[];
                let seriesData=[];
                result.root.list.map(function (item,index,arr) {
                    indicator.push({'text':item.name,'max':100.00,'min':-50});
                    seriesData.push(item.cacheRatio);
                })
                series.push(
                    {
                        name: 'Cache命中率',
                        type: 'radar',
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default',
                                    opacity: .3,
                                }
                            }
                        },
                        data: [{'value':seriesData,'name':'Cache命中率'}]
                    }
                );
                // 绘制图表
                this.drawGauge2Chart('cacheHitRatio', 'Cache命中率',indicator,series);
            } else {
                message.error(result.retMsg);
            }
        });
    }

    //PGA指导
    pgaTagertAdvice(nodeInstance){
        getService(API_PREFIXOracle + '/pgaTagertAdvice/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let values=[];
                let seriesData=[];
                let dataIndex = 0;
                let estdOverallocCountData = [];
                result.root.list.map(function (item,index,arr) {
                    if(item.pgaTargetFactor == 1){
                        dataIndex = index;
                    }
                    values.push(item.pgaSize);
                    estdOverallocCountData.push(item.estdOverallocCount);
                    seriesData.push([item.pgaSize,item.estdPgaCacheHitPercentage]);
                })
                this.setState({
                    estdOverallocCountData:estdOverallocCountData,
                })
                series.push(
                    {
                        name:'PGA参考值',
                        type:'line',
                        //lineStyle:'FFF',
                         //itemStyle:{
                           // normal:{
                               // color:'#00FF00',}},
                        //symbol:'arrow', //图标形状
                        // symbolSize:10,  //图标尺寸
                        itemStyle:{
                            normal:{
                                color: function (data) {
                                    if(data.dataIndex==dataIndex){
                                        return 'rgba(52, 67, 89, 1)';
                                    }else {
                                        return 'rgba(239, 209, 66, 1)';
                                    }
                                } //图标颜色
                            }
                        },
                        lineStyle:{
                            normal:{
                                //width:10,  //连线粗细
                                color: 'rgba(172, 61, 57, 1)'  //连线颜色
                            }
                        },
                        data:seriesData,
                    }
                );
                // 绘制图表
                this.drawLineChart2('pgaTagertAdvice', 'PGA参考值',series,values,'PGA参考值','估计的高速缓存命中百分比');
            } else {
                message.error(result.retMsg);
            }
        });
    }

    //SGA指导
    sgaTagertAdvice(nodeInstance){
        const that = this;
        getService(API_PREFIXOracle + '/sgaTagertAdvice/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let values=[];
                let seriesData=[];
                let dataIndex = 0;
                let estdPhysicalReadsData=[];
                result.root.list.map(function (item,index,arr) {
                    if(item.sgaSizeFactor == 1){
                        dataIndex = index;
                    }
                    values.push(item.sgaSize);
                    seriesData.push([item.sgaSize,(item.estdDbTimeFactor-1)*100]);
                    estdPhysicalReadsData.push(item.estdPhysicalReads);
                })
                that.setState({
                    estdPhysicalReadsData:estdPhysicalReadsData,
                })
                series.push(
                    {
                        name:'SGA参考值',
                        type:'line',
                        // itemStyle:{normal:{label:{show:true}}},
                        itemStyle:{
                            normal:{
                                color: function (data) {
                                    if(data.dataIndex==dataIndex){
                                        return 'rgba(52, 67, 89, 1)';
                                    }else {
                                        return 'rgba(239, 209, 66, 1)';
                                    }
                                } //图标颜色
                            }
                        },
                        lineStyle:{
                            normal:{
                                //width:10,  //连线粗细
                                color: 'rgba(172, 61, 57, 1)'  //连线颜色
                            }
                        },
                        data:seriesData,
                    }
                );
                // 绘制图表
                this.drawLineChart2('sgaTagertAdvice', 'SGA参考值',series,values,'SGA参考值','估计节省的时间百分比');
            } else {
                message.error(result.retMsg);
            }
        });
    }

    //DBCache指导
    dbCacheAdvice(nodeInstance){
        getService(API_PREFIXOracle + '/dbCacheAdvice/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let values=[];
                let seriesData=[];
                let dataIndex = 0;
                result.root.list.map(function (item,index,arr) {
                    if(item.sizeFactor == 1){
                        dataIndex = index;
                    }
                    values.push(item.sizeForEstimate);
                    seriesData.push([item.sizeForEstimate,item.estdPhysicalReadFactor]);
                })
                series.push(
                    {
                        name:'DataBase参考缓存值',
                        type:'line',
                        // itemStyle:{normal:{label:{show:true}}},
                        itemStyle:{
                            normal:{
                                color: function (data) {
                                    if(data.dataIndex==dataIndex){
                                        return 'rgba(52, 67, 89, 1)';
                                    }else {
                                        return 'rgba(239, 209, 66, 1)';
                                    }
                                } //图标颜色
                            }
                        },
                        lineStyle:{
                            normal:{
                                //width:10,  //连线粗细
                                color: 'rgba(172, 61, 57, 1)'  //连线颜色
                            }
                        },
                        data:seriesData,
                    }
                );
                // 绘制图表
                this.drawLineChart2('dbCacheAdvice', '物理读的速率',series,values,'参考缓存值','物理读的速率');
            } else {
                message.error(result.retMsg);
            }
        });
    }

    //dbFileIO
    dbFileIO(nodeInstance){
        getService(API_PREFIXOracle + '/dbFileIO/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let phyrdsData=[];
                let phywrtsData=[];
                let legendData=['物理读','物理写','文件大小'];
                let values = [];
                let xValues=[];
                let yAxis =[
                    {
                        type : 'value',
                        name : '次数',
                        axisLabel : {
                            formatter: '{value} 次'
                        }
                    },
                    {
                        type : 'value',
                        name : '占据空间大小',
                        axisLabel : {
                            formatter: '{value} M'
                        }
                    }
                ];
                result.root.list.map(function (item,index,arr) {
                    phyrdsData.push(item.phyrds);
                    phywrtsData.push(item.phywrts);
                    xValues.push(item.name);
                    values.push(item.value)
                })
                series.push(
                    {
                        name: '物理读',
                        type: 'line',
                        data: phyrdsData,
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: '#ff7f50',
                            }
                        }
                    }
                );
                series.push(
                    {
                        name: '物理写',
                        type: 'line',
                        data: phywrtsData,
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: '#0f44e0',
                            }
                        }
                    }
                );
                series.push(
                    {
                        name: '文件大小',
                        type: 'bar',
                        data: values,
                        smooth:true,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#003366',
                            }
                        }
                    }
                );
                // 绘制图表
                this.drawLineChart3('dbFileIO', 'DBFileIO使用情况',series,legendData,xValues,yAxis);
            } else {
                message.error(result.retMsg);
            }
        });
    }
    tablespaceIO(nodeInstance){
        getService(API_PREFIXOracle + '/tablespaceIO/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let phyrdsData=[];
                let phywrtsData=[];
                let phyblkrdData = [];
                let phyblkwrtData = [];
                let values = [];
                let legendData=['物理读','物理写','块读取数','写入磁盘的块数'];
                let xValues=[];
                result.root.list.map(function (item,index,arr) {
                    phyrdsData.push(item.phyrds);
                    phywrtsData.push(item.phywrts);
                    phyblkrdData.push(item.phyblkrd);
                    phyblkwrtData.push(item.phyblkwrt);
                    xValues.push(item.name);
                    values.push(item.value)
                })
                let yAxis=[
                    {
                        type : 'value',
                        name : '次数',
                        axisLabel : {
                            formatter: '{value} 次'
                        }
                    },];
                series.push(
                    {
                        name: '物理读',
                        type: 'line',
                        data: phyrdsData,
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: '#ff7f50',
                            }
                        }
                    }
                );
                series.push(
                    {
                        name: '物理写',
                        type: 'line',
                        data: phywrtsData,
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: '#0f44e0',
                            }
                        }
                    }
                );
                series.push(
                    {
                        name: '块读取数',
                        type: 'line',
                        data: phywrtsData,
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: '#cd5c5c',
                            }
                        }
                    }
                );
                series.push(
                    {
                        name: '写入磁盘的块数',
                        type: 'line',
                        data: phyblkwrtData,
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: '#e23c08',
                            }
                        }
                    }
                );
                // 绘制图表
                this.drawLineChart3('tablespaceIO', 'tablespaceIO使用情况',series,legendData,xValues,yAxis);
            } else {
                message.error(result.retMsg);
            }
        });
    }
   //内存池使用情况
    cachePoolUsage(nodeInstance){
        getService(API_PREFIXOracle + '/cachePoolUsage/'+nodeInstance, result => {
            if (result.retCode===1) {
                let series = [];
                let yAxis=[];
                series.push(
                    {
                        name:'已使用空间',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: false, position: 'insideRight'}}},
                        data:result.root.list.map(function (item,index,arr) {
                            yAxis.push(item.name);
                            return item.used;
                        })
                    },
                );
                series.push({
                    name:'空闲空间',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: false, position: 'insideRight'}}},
                    data:result.root.list.map(function (item,index,arr) {
                        return item.free;
                    })
                });
                // 绘制图表
                this.drawBarChart('cachePoolUsage', '内存池使用情况', yAxis,series);
            } else {
                message.error(result.retMsg);
            }
        });
    }

    //sga分配情况
    sgaAllot(nodeInstance){
        let that = this;
        getService(API_PREFIXOracle + '/sgaAllot/'+nodeInstance, result => {
            if (result.retCode===1) {
                let nodeNames = [];
                let seriesData = [];
                result.root.list&& result.root.list.map((s,j)=>{
                    seriesData.push({value:s.total,name:s.name});
                    nodeNames.push(s.name);
                })
                let series = [{
                    name: 'sga分配情况',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                   /* label: {
                        normal: {
                            show: true,
                            position: 'inside',
                        },
                    },*/
                    data:seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} : {c} ({d}%)',
                            },
                            labelLine: { show: true },
                            // color:function (data) {
                            //     if(data.dataIndex == 0){
                            //         return 'rgba(52, 67, 89, 1)';
                            //     }else if(data.dataIndex ==1){
                            //         if((result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage)/result.root.object.data[0].data.result[0].values[0].usage>= 0.8){
                            //             that.setState({
                            //                 content1:'存储告警！！！',
                            //             })
                            //             return 'rgba(172, 61, 57, 1)';
                            //         }else if((result.root.object.data[0].data.result[0].values[0].usage - result.root.object.data[1].data.result[0].values[0].usage)/result.root.object.data[0].data.result[0].values[0].usage< 0.8){
                            //             that.setState({
                            //                 content1:null,
                            //             })
                            //             return 'rgba(239, 209, 66, 1)';
                            //         }
                            //     }
                            // }
                        },
                    },
                }];
                // 绘制图表
                this.drawPieChart('sgaAllot', 'sga分配情况(M)', nodeNames, series);
            } else {
                message.error(result.retMsg);
            }
        });
    }
  //绘制折线图
  drawLineChart(divId, chartTitle, names, series, values) {
    if (this.lineChart[divId] === undefined) {
      this.lineChart[divId] = echarts.init(document.getElementById(divId));
    }
    this.lineChart[divId].setOption({
      //title: {text:chartTitle},
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
        },
      },

      legend: {
        data: names,
        //left:'10%',
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: true,
        },
        interval: 5000,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true,
        },
        // min: 0,
        // max: Math.floor(Math.max.apply(null, values)) + 10,
      },
      series: series,
    });
  }
    drawLineChart2(divId, chartTitle, series, values,xAxisName,yAxisName) {
        const that = this;
        if (this.lineChart[divId] === undefined) {
            this.lineChart[divId] = echarts.init(document.getElementById(divId));
        }
        this.lineChart[divId].setOption({
            title : {
               // text: 'PGA指导',
            },
            grid:{
                left:'30%',
            },
            tooltip : {
                // trigger: 'axis',
                 formatter : function (params) {
                     console.log("!!!!!!!!!!!!!!!!",params,that.state.estdOverallocCountData)
                     if(divId === 'pgaTagertAdvice'){
                         return params.seriesName + ' : '
                             + params.value[0]+'M'+'<br/>'+'高速缓存百分比：'+params.value[1]+'%'+'<br/>'+'预估PGA超过分配的次数：'+that.state.estdOverallocCountData[params.dataIndex];
                     }else if(divId === 'sgaTagertAdvice'){
                         return params.seriesName + ' : '
                             + params.value[0]+'M'+'<br/>'+'估计节省的时间百分比：'+params.value[1].toFixed(2)+'%'+'<br/>'+'估计物理读的次数：'+that.state.estdPhysicalReadsData[params.dataIndex];
                     }else {
                         return params.seriesName + ' : '
                             + params.value[0]+'M'+'<br/>'+'物理读的速率：'+params.value[1];
                     }

                }
            },
            // legend: {
            //     // show:true,
            //     //data:[{name:chartTitle,color:'rgba(52, 67, 89, 1)'}],
            //     // borderColor:'rgba(52, 67, 89, 1)',
            //     // color:'rgba(52, 67, 89, 1)',
            //     // shadowColor:'rgba(52, 67, 89, 1)',
            //     //backgroundColor:'rgba(52, 67, 89, 1)',
            //     //formatter:function (params) {
            //     //    return '当前设置'
            //     //}
            // },
            calculable : true,
            xAxis : [
                {
                    type: 'value',
                     name:xAxisName,
                     nameLocation:'start',
                    nameGap:'30',
                    // boundaryGap: [0, '100%'],
                    // splitLine: {
                    //     show: true,
                    // },
                    // min: Math.floor(Math.min.apply(null, values)) - 100,
                    // max: Math.floor(Math.max.apply(null, values)) + 100,
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    name:yAxisName,
                    // axisLine: {
                    //     lineStyle: {
                    //         color: '#dc143c',
                    //         //formatter: '{value} '
                    //     }
                    // }
                }
            ],
            series : series,
        });
    }

    drawLineChart3(divId, chartTitle, series,legendData,xValues,yAxis) {
        if (this.lineChart[divId] === undefined) {
            this.lineChart[divId] = echarts.init(document.getElementById(divId));
        }
        this.lineChart[divId].setOption({
            title: {
                text: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legendData,
                type: 'scroll',
                orient: 'horizontal',
                animation: true,
                // right: '-1%',
                // top: '8%',
                // bottom: '25%',
               // itemGap: 10,
            },
            grid: {
                top: '15%',
                left: '3%',
                right: '3%',
                bottom: '20%',
                containLabel: true
            },
            dataZoom:{
                type: 'inside',
                handleSize: 7,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {show: false},
                data: xValues,
                boundaryGap: ['30%', '30%'],
                axisLabel: {
                    interval: 0,
                    rotate: 30,
                }
            },
            yAxis: yAxis,
            series: series,
        });
    }

  //绘制雷达图
  drawGaugeChart(divId, chartTitle, series) {
    if (this.gaugeChart[divId] === undefined) {
      this.gaugeChart[divId] = echarts.init(document.getElementById(divId));
    }
    this.gaugeChart[divId].setOption({
      //title: { text: chartTitle},
      tooltip: {
        formatter: '{b} : {c}%',
      },

      series: series,
    });
  }
  drawBarChart(divId,names, yAxis,series) {
    if (this.barChart[divId] === undefined) {
      this.barChart[divId] = echarts.init(document.getElementById(divId));
    }
    this.barChart[divId].setOption({
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid:{
            left:'15%',
        },
        legend: {
            data:['已使用空间', '空闲空间']
        },

        calculable : true,
        xAxis : [
            {
                type : 'value'
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : yAxis,
            }
        ],
        series : series,
    });
    }
  drawBar2Chart(divId,names, xAxis,series) {
        console.log("xAxis",xAxis)
    if (this.bar2Chart[divId] === undefined) {
      this.bar2Chart[divId] = echarts.init(document.getElementById(divId));
    }
    this.bar2Chart[divId].setOption(
        {
            color: ['#003366'],
            tooltip: {
                trigger: 'axis',
                show:true,
                // axisPointer: {
                //     type: 'shadow'
                // }
            },
            legend: {
                data: ['session连接数']
            },
            grid:{
                bottom:'30%',
                left:'20%',
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {show: false},
                    data: xAxis,
                    boundaryGap: ['30%', '30%'],
                    axisLabel: {
                        interval: 0,
                        rotate: 30,
                    }
                }
                /*{
                    type: 'category',
                    axisTick: {show: false},
                    data: xAxis,
                }*/
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            dataZoom:{
                type: 'inside',
                handleSize: 7,
            },
            series: series
        }
       );
    }

    //绘制雷达图
    drawGauge2Chart(divId, chartTitle, indicator,series) {
        if (this.gaugeChart2[divId] === undefined) {
            this.gaugeChart2[divId] = echarts.init(document.getElementById(divId));
        }
        this.gaugeChart2[divId].setOption({
            title : {
                //text: 'Cache命中率',
            },
            tooltip : {
                // trigger: 'axis'
            },
            legend: {
                orient : 'vertical',
                x : 'center',
                y : 'top',
                data:['Cache命中率']
            },

            polar : [
                {
                    indicator : indicator,
                }
            ],
            calculable : true,
            series : series,
        }
     );
    }

    drawPieChart(divId, chartTitle, names, series) {
        if (this.pieChart[divId] === undefined) {
            this.pieChart[divId] = echarts.init(document.getElementById(divId));
        }
        this.pieChart[divId].setOption({
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            legend: {
                data: names,
                orient : 'horizontal',
                x : 'center',
                y : 'top',
            },
            label: {
                normal: {
                    show: true,
                },
            },

            series: series,
        });
    }
  // changeTabs(key) {
  //     //请求node数据
  //     if (this.lineChart['nodeNetworkUsage']) {
  //       this.lineChart['nodeNetworkUsage'].clear();
  //     }
  //     this.nodeUsage(this.state.nodeIp);
  // }
  changeNodeIps = (value) => {
    this.lineChart['nodeNetworkUsage'].clear();
      clearInterval(this.intervalNodeUsage);
      this.nodeUsage(value);
      this.setState({
          nodeIp: value,
      });
  }

    changeNodeInstances = (value) =>{
      //清除interval
        clearInterval(this.intervalInstanceUsage);
        this.instanceUsage(value);
      this.setState({
          nodeInstance: value,
      })

    }

  //加onChange
    onSelected=(key)=>{
      let nodeIp = this.state.nodeIp;
      if(key ==2){
          clearInterval(this.intervalNodeUsage);
          getService(API_PREFIXOracle + '/getDataSource', result => {
              if (result.retCode===1) {
                  this.setState({
                      nodeInstances: result.root.list,
                      nodeInstance: result.root.list[1],
                  });
                  this.instanceUsage(this.state.nodeInstance);
              } else {
                  message.error(result.retMsg);
              }
          });
      }else if(key==1){
          let that = this;
          clearInterval(this.intervalInstanceUsage);
          //debugger;
          this.intervalNodeUsage = setInterval(() => {
              that.nodeNetworkUsage(nodeIp);
              that.nodeMemoryUsage(nodeIp);
              that.nodeCpuUsage(nodeIp);
              that.nodeFsUsage(nodeIp);
          }, 5000);
      }
    }
  render() {
    return (
        <div>
        <Tabs type="card"  defaultActiveKey="1" className="tab-comm"  onChange={this.onSelected}>
            <TabPane tab="应用服务器" key="1" >
                <div className="monitoringPage">
                    <div className="query-tab">
                        <span>物理节点：</span>
                        <Select getPopupContainer={()=>document.getElementsByClassName('y-main')[0]}  key={this.state.nodeIps[0].metric.name} defaultValue={this.state.nodeIps[0].metric.name} style={{ width: 180 }} onChange={this.changeNodeIps} showSearch allowClear>
                            {
                                this.state.nodeIps.map(v => {
                                    return (
                                        <Option key={v.metric.name} value={v.metric.name}>{v.metric.name}</Option>
                                    );
                                })
                            }
                        </Select>
                    </div>
                    <Card title="网络状况(KB)" bodyStyle={{ padding: 0 }}>
                        <Row>
                            <Col span={24} className="monitoring">
                                <Spin spinning={this.state.loading}>
                                    <div id="nodeNetworkUsage" style={{ height: 400 }} />
                                </Spin>
                            </Col>
                        </Row>
                    </Card>
                    <Row>
                        <Col span={12}>
                            <Card title="内存使用状况(G)"  extra={this.state.content} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="nodeMemoryUsage" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="存储使用状况(G)" extra={this.state.content1}  bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="nodeFsUsage" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Card title="CPU使用状况" bodyStyle={{ padding: 0 }}>
                        <Row>
                            <Col span={24} className="monitoring">
                                <Spin spinning={this.state.loading}>
                                    <div id="nodeCpuUsage" style={{ height: 400 }} />
                                </Spin>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </TabPane>
            <TabPane tab="数据库服务器" key="2">
                <div className="monitoringPage">
                    <div className="query-tab">
                        <span>Oracle数据库实例：</span>
                        <Select getPopupContainer={()=>document.getElementsByClassName('y-main')[0]}  key={this.state.nodeInstances[1]} defaultValue={this.state.nodeInstances[1]} style={{ width: 180 }} onChange={this.changeNodeInstances} showSearch allowClear>
                            {
                                this.state.nodeInstances.map(v => {
                                    return (
                                        <Option key={v} value={v}>{v}</Option>
                                    );
                                })
                            }
                        </Select>
                    </div>
                    <Card title="表空间使用状况(M)"  extra={<Tooltip title="临时表：TEMP"><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                        <Row>
                            <Col span={24} className="monitoring">
                                <Spin spinning={this.state.loading}>
                                    <div id="tableSpaceUsage" style={{ height: 400 }} />
                                </Spin>
                            </Col>
                        </Row>
                    </Card>
                    <Row>
                        <Col span={12}>
                            <Card title="Session会话连接状况(个)" extra={<Tooltip title="Session会话：当前连接该数据库会话的个数合计"><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="sessionInfo" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Cache命中率状况(%)"  extra={<Tooltip
                                title={title1}><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>}  bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="cacheHitRatio" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Card title="PGA指导"
                                extra={<Tooltip title={title2}><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="pgaTagertAdvice" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                    <span className="legened"><span style={{ fontSize: 8, color: '#9a413e', verticalAlign: 'unset' }}>—</span><img src={circle} style={{ fontSize: 8, color: '#554959' }} /><span style={{ fontSize: 8, color: '#9a413e', verticalAlign: 'unset'}}>—</span>当前设置</span>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="SGA指导" extra={<Tooltip title={title3}><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>}  bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="sgaTagertAdvice" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                    <span className="legened"><span style={{ fontSize: 8, color: '#9a413e', verticalAlign: 'unset' }}>—</span><img src={circle} style={{ fontSize: 8, color: '#554959' }} /><span style={{ fontSize: 8, color: '#9a413e', verticalAlign: 'unset'}}>—</span>当前设置</span>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="DBCache指导"  extra={<Tooltip title={title4}><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="dbCacheAdvice" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                    <div className="legened"><span style={{ fontSize: 8, color: '#9a413e', verticalAlign: 'unset'}}>—</span><img src={circle} style={{ fontSize: 8, color: '#554959' }} /><span style={{ fontSize: 8, color: '#9a413e', verticalAlign: 'unset'}}>—</span>当前设置</div>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Card title="DBFileIO" extra={<Tooltip title={title5}><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="dbFileIO" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="tablespaceIO"  extra={<Tooltip title={title6}><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="tablespaceIO" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Card title="内存池使用情况(M)" extra={<Tooltip title="内存池使用情况"><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="cachePoolUsage" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="SGA分配情况(M)"  extra={<Tooltip title={title7}><Icon type="question-circle-o" style={{ fontSize: 18, color: '#fff' }}/></Tooltip>} bodyStyle={{ padding: 0 }}>
                                <Row>
                                    <Col span={24} className="monitoring">
                                        <Spin spinning={this.state.loading}>
                                            <div id="sgaAllot" style={{ height: 400 }} />
                                        </Spin>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </TabPane>
        </Tabs>
      </div>
    );
  }
}
