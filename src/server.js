// 启动Elastic APM agent
// 必须在入口文件的顶部，在require其他所有模块之前
const apm = require('elastic-apm-node').start({
  serviceName: 'kibana-research',

  // active: 一个布尔值，默认值：true， 指定代理是否应该激活。如果处于活动状态，代理将处理传入的HTTP请求并跟踪错误。通常情况下，您不希望在开发或测试环境中运行代理。
  // active: process.env.NODE_ENV === 'production'

  // instrument: 一个布尔值，默认值：true, 指定代理是否应收集应用程序的性能指标。active和instrument配置都必须为true才可以生效

  ignoreUrls: ['/logging/ping']
  // captureBody: 'all'
});

const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');

const { logging, filterHttpHeaders, form } = require('./routes');
const { schema, root } = require('./graphql');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/logging', logging(apm));
app.use('/filterHttpHeaders', filterHttpHeaders(apm));
app.use('/form', form(apm));
app.use(
  '/graphql',
  graphqlHTTP(req => {
    // console.log('body: ', req.body);
    return {
      schema,
      rootValue: root,
      graphiql: true
    };
  })
);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
