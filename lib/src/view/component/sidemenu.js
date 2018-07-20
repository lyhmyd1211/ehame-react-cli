import React, { Component } from 'react';
import {  Menu } from 'antd';
import CustomScrollbars from './scrollbars.js';

const SubMenu = Menu.SubMenu;

class SideMenu extends Component {
  constructor(props) {
    super(props);
    const str = location.hash.match(/#(\S+)\?/) || location.hash.match(/#(\S+)/);
    const open = str[1].split('/');
    let openKeys = [];
    if (open[1] === '404') {
      console.log('error',);
    } else if (open.length === 4) {
      openKeys = ['#/' + open[1], '#/' + open[1] + '/' + open[2]];
    } else if (open.length === 3) {
      openKeys = ['#/' + open[1]];
    }
    this.state = {
      selectedKeys: ['#' + str[1]],
      openKeys,
      rootSubmenuKeys: [],
      collapsed: false,
      marginLeft: '5%',
      //  openKeys: ['#/monthly/supervision', '#/monthly'],
    };
    window.addEventListener('hashchange', this.hashChg, false);
  }

  //hashchange
  hashChg = () => {
    document.documentElement.scrollTop ? (document.documentElement.scrollTop = 0) : (document.body.scrollTop = 0);
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

    this.setState({
      selectedKeys: ['#' + str[1]],
      openKeys,
    });
  }
  onOpenChange = (openKeys) => {
    this.props.menu.map((s, v) => {
      this.state.rootSubmenuKeys.push(s.key);
    });
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener('hashchange', this.hashChg, false);

  };
  toggleCollapsed = () => {
    // this.setState({
    //   collapsed: !this.state.collapsed,
    // });
    this.props.toggleCollapsed();
  }
  render() {
    const { menu, collapsed } = this.props;
    const { openKeys } = this.state;
    return (
      <div className="sider-inner" style={{ width: collapsed ? '300px' : '200px' }}>
        <CustomScrollbars className="side-scrollbar" autoHide={true} drawVertical={true} disabled={collapsed}>
          <Menu
            mode="inline"
            onOpenChange={this.onOpenChange}
            openKeys={openKeys}
            inlineIndent={38}
            style={{
              minHeight: '100%',
            }}
          >
            {

              menu.map((v, i) => {
                if (v.subMenu) {
                  let selected = (v.key == openKeys);
                  return <SubMenu key={v.key} title={<span className="home-submenu"><img src={selected ? v.selectedImgUrl : v.defaultImgUrl} style={{ padding: collapsed ? '10px 30px' : '10px 0px', marginRight: '12px' }} /> {v.title}</span>}>
                    {
                      v.subMenu.map((w, j) => {

                        return <Menu.Item key={w.key}><a href={w.url} className="home-submenu" style={{fontSize:'1.3rem'}}>{w.title}</a></Menu.Item>;

                      })
                    }
                  </SubMenu>;
                } else {
                  return (
                    <Menu.Item key={v.key}>
                      <a href={v.url} className="home-a-menu" style={{ fontSize: '1.3rem' }}>
                        <img src={v.defaultImgUrl} style={{ padding: collapsed ? '10px 30px' : '10px 0px', marginRight: '12px' }} />
                        <span className="home-menu">{v.title}</span>
                      </a>
                    </Menu.Item>
                  );
                }
              })
            }
          </Menu>
        </CustomScrollbars>
      </div>
    );
  }
}

export default SideMenu;
