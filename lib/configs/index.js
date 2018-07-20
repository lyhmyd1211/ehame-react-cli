module.exports = {
  APP_NAME:'XXX系统',
  PORT:process.env.PORT || 8600,
  PROXY_OPTION: {
    //   target: 'http://10.110.200.62:443/',
    target: 'http://172.16.34.188:443/',
    changeOrigin: true,
  },
};
