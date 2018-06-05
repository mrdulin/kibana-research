const express = require('express');
const router = express.Router();

// https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/express.html#express-filter-sensitive-information
// 默认地，apm agent会过滤敏感信息
function filterHttpHeaders(apm) {
  // 测试apm agent默认过滤request header中的`Authorization`字段
  // 为了对比，特意在request header中加入了Company字段，查看是否被过滤
  // curl -H 'Authorization: googleadmin' -H 'Company: google' http://localhost:3000/filterHttpHeaders/filter-Authorization
  // 测试截图: https://ws3.sinaimg.cn/large/006tKfTcgy1fs0im9fw1rj31kw0x8wg1.jpg
  router.get('/filter-Authorization', (req, res) => {
    const authorization = req.get('Authorization');
    console.log('authorization: ', authorization);
    res.send(authorization);
  });

  return router;
}

module.exports = filterHttpHeaders;
