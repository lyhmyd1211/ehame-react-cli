import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux-root/store';


import App from './router/index.js';
import 'yrui/lib/yrui.css';
import './styles/common.less';
import 'font-awesome/css/font-awesome.css';
import moment from 'moment';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

render(<Provider store={store}>
  <App />

</Provider>, document.getElementById('app'));
