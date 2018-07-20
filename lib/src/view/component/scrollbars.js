import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import './scrollbars.less';
export default class CustomScrollbars extends Component {
  render() {
    let autoHideTmp = this.props.autoHide === undefined ? false : this.props.autoHide;
    let horizontal = this.props.drawHorizontal === undefined ? false : this.props.drawHorizontal;
    let vertical = this.props.drawVertical === undefined ? false : this.props.drawVertical;
    let disabled = this.props.disabled === undefined ? false : this.props.disabled;
    return (
      <Scrollbars className="side-scrollbar"
        autoHide={autoHideTmp}
        renderTrackHorizontal={horizontal ? props => <div {...props} className="track-horizontal" style={disabled ? { height: '0%' } : { height: '100%', position: 'absolute', width: '6px' }} /> : props => <div {...props} />}
        renderTrackVertical={vertical ? props => <div {...props} className="track-vertical" style={disabled ? { height: '0%' } : { height: '100%', position: 'absolute', width: '6px' }} /> : props => <div {...props} />}
        renderThumbHorizontal={horizontal ? props => <div {...props} className="thumb-horizontal" /> : props => <div {...props} />}
        renderThumbVertical={vertical ? props => <div {...props} className="thumb-vertical" /> : props => <div {...props} />}
        renderView={props => <div {...props} className="view" />}>
        {this.props.children}
      </Scrollbars>
    );
  }
}
