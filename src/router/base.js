import React, { Component } from 'react';
import { Layout, Affix, Breadcrumb  } from 'antd';
import { sidebarMenu } from './models';
import { getBreadcrumb } from '../view/component/tools';
import SideMenu from '../view/component/sidemenu.js';
import Head from '../view/component/head.js';
// import { Main } from 'yrui';
const fold = require('../styles/images/sidebarMenu/icon_fold.png');
const un_fold = require('../styles/images/sidebarMenu/icon_unfold.png');

const { Header, Content, Sider } = Layout;

const getsidebarMenu = (obj, powers) => {
  if (powers) {
    const arr = [];
    obj.forEach(v => {
      if (v.subMenu) {
        const arr2 = getsidebarMenu(v.subMenu, powers);
        if (arr2.length > 0) {
          // arr.push(arr2);
          arr.push({
            url: v.url,
            title: v.title,
            key: v.key,
            defaultImgUrl: v.defaultImgUrl,
            selectedImgUrl: v.selectedImgUrl,
            subMenu: arr2,
          });
        }
      } else {
        if (v.power === undefined || powers[v.power]) {
          arr.push(v);
        }
      }
    });
    return arr;
  } else {
    return obj;
  }
};


export default class Base extends Component {

  constructor(props) {
    super(props);
    const str = location.hash.match(/#(\S+)\?/) || location.hash.match(/#(\S+)/);
    const open = str[1].split('/');
    let openKeys = [];
    if (open[1] === '404') {
      console.log('error');
    } else if (open.length === 4) {
      openKeys = ['#/' + open[1], '#/' + open[1] + '/' + open[2]];
    } else if (open.length === 3) {
      openKeys = ['#/' + open[1]];
    }
    this.state = ({
      menu: sidebarMenu,
      breadcrumb: [],
      flag: true,
      url: fold,
      collapsed: false,
    });
    window.addEventListener('hashchange', this.hashChg, false);
  }

  hashChg = () => {
    document.documentElement.scrollTop ? (document.documentElement.scrollTop = 0) : (document.body.scrollTop = 0);
    let str = location.hash.match(/#(\S+)\?/) || location.hash.match(/#(\S+)/);
    let breadcrumb = getBreadcrumb(sidebarMenu, str);
    const open = str[1].split('/');
    let openKeys = [];
    if (open[1] === '404') {
      console.log('error');
    } else if (open.length === 4) {
      openKeys = ['#/' + open[1], '#/' + open[1] + '/' + open[2]];
    } else if (open.length === 3) {
      openKeys = ['#/' + open[1]];
    }
    this.setState({
      breadcrumb: breadcrumb,
      selectedKeys: ['#' + str[1]],
      openKeys,
    });
  }

  componentWillMount = () => {
    this.hashChg();
  }

  componentWillUnmount = () => {
    window.removeEventListener('hashchange', this.hashChg, false);
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentDidMount() {

  }
  render() {
    const { children, powers } = this.props;
    const { breadcrumb } = this.state;

    /**可判断是否只可点击二级面包屑 */
    const breadcrumbItems = 
      breadcrumb.map(item=>{
        return <Breadcrumb.Item key={item.title}>
          <a href={`${item.url}`}>{item.title}</a>
        </Breadcrumb.Item>;});

    return (
      <Layout>
        <Affix style={{ position: 'relative', zIndex: 99 }}>
          <Header className="headers"
          >
            <Head />
          </Header>
        </Affix>
        <Layout style={{ overflow: 'hidden' }} className="base-layout">
          {/* <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.toggleCollapsed}
            trigger={
              <img src={this.state.collapsed ? fold : un_fold} onClick={this.toggleCollapsed} />
            }
            style={
              { background: '#fff' }
            }
          > */}
          <Affix offsetTop={64}>
            <SideMenu menu={getsidebarMenu(sidebarMenu, powers)} {...this.state} toggleCollapsed={this.toggleCollapsed} />
          </Affix>
          {/* </Sider> */}
          
          <Content style={{ overflow: 'auto' }}>
            <Breadcrumb style={{padding:'20px'}}>
              {breadcrumbItems}
            </Breadcrumb>
            {            
              children
            }
          </Content>

        </Layout>
      </Layout>
    );
  }
}

