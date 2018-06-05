const express = require('express');
const router = express.Router();

function logging(apm) {
  // 默认情况下，当检测到未捕获的异常时，代理将终止Node.js进程。如果您需要在流程终止之前运行任何自定义代码，请使用此函数。
  // apm.handleUncaughtExceptions(err => {
  //   console.log('Do your own stuff... and then exit:');
  //   process.exit(1);
  // });

  // router.get('/uncaught-exception', (req, res) => {
  //   const msg = 'exception happened';
  //   const a = msg.a.a;

  //   res.send(msg);
  // });

  // https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/express.html#express-error-logging
  router.get('/capture-error', (req, res) => {
    const { query } = req;
    if (query.error) {
      const msg = 'Ups, something broke!';
      const err = new Error(msg);
      return apm.captureError(err, () => {
        res.send(msg);
      });
    }
    res.send('normal');
  });

  // https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/agent-api.html#message-strings
  // kibana的APM面板中，该错误在Log stacktrace下显示，在Exception stacktrace下不会有任何信息
  router.get('/capture-error-with-message-strings', (req, res) => {
    apm.captureError('Something happened!', () => {
      res.send('Something happened!');
    });
  });

  // https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/agent-api.html#parameterized-message-object
  // 提供结构化数据，可以更好的组织包含变量的错误信息，例如包含变量id和name
  router.get('/capture-error-with-parameterized-message-object', (req, res) => {
    const obj = {
      message: 'Could not find user %s with id %d in the database',
      params: ['Peter', 42]
    };
    apm.captureError(obj, () => {
      res.send('capture-error-with-parameterized-message-object');
    });
  });

  // https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/agent-api.html#metadata
  // 为了便于调试，可以在发送给APM服务器的每个错误中发送一些额外的数据。
  router.get('/capture-error-with-metadata-1', (req, res) => {
    // Sending some extra details about the user
    const msg = 'Sending some extra details about the user';
    const error = new Error(msg);
    apm.captureError(
      error,
      {
        user: {
          id: 'unique_id',
          username: 'foo',
          email: 'foo@example.com'
        }
      },
      () => {
        res.send(msg);
      }
    );
  });

  router.get('/capture-error-with-metadata-2', (req, res) => {
    // Sending some arbitrary details using the `custom` field
    const msg = 'Sending some arbitrary details using the `custom` field';
    const error = new Error(msg);
    apm.captureError(
      error,
      {
        custom: {
          some_important_metric: 'foobar'
        }
      },
      () => {
        res.send(msg);
      }
    );
  });

  // https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/agent-api.html#http-requests
  // https://www.elastic.co/guide/en/apm/agent/nodejs/1.x/agent-api.html#http-responses
  // 这将记录所请求的URL，HTTP标头，Cookie和其他有用的详细信息，以帮助您调试错误。
  // 但在大多数情况下，这并不是必需的，因为代理在判断Node.js应用程序是否是HTTP服务器以及在传入请求期间是否发生错误时非常聪明。在这种情况下，它会为您自动执行此过程。
  router.get('/capture-error-http-request', (req, res) => {
    const msg = 'capture-error-http-request';
    const err = new Error(msg);
    apm.captureError(
      err,
      {
        request: req
      },
      () => {
        res.send(msg);
      }
    );
  });

  // 测试apm的ignoreUrls, 该路由中的异常将不会被发送到apm server
  router.get('/ping', (req, res) => {
    const msg = 'ping';
    apm.captureError(msg, () => {
      res.send(msg);
    });
  });

  return router;
}

module.exports = logging;
