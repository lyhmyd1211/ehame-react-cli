import React, { Component } from   'react';
import './head.less';
import * as action2 from 'redux-root/action/powers.js';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import API_PREFIX from '../content/apiprefix';
import { getService,postService } from '../content/myFetch.js';




function mapDispatchToProps(dispatch) {
  return bindActionCreators({  ...action2 }, dispatch);
}


@connect(
  state => ({
    powers: state.powers,
  }),
  mapDispatchToProps
)

class Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    
  }
  componentWillMount() {

    // if (!window.sessionStorage.lastname) {
    //   location.hash = '#/login';
    // }
    // $q.get($q.url + '/security/authInfo', data => {
    //   if (window.sessionStorage.lastname === 'root' && data.permissions.length === 0) {
    //     this.props.getPowers(false);
    //   } else {
    //     let obj = {};
    //     data.permissions.map(v => {
    //       obj[v] = true;
    //     });
    //     this.props.getPowers(obj);
    //   }
    // });
  }



  render() {
    return (
      <div className = "root-head clearfix"> 
        <div>test</div>
      </div>
    );
  }
}
export default Head;
