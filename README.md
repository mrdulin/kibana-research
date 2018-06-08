# kibana-research

## 安装

```bash
brew install elasticsearch
```

```bash
elasticsearch-plugin install x-pack
```

```bash
brew install kibana
```

```bash
kibana install x-pack
```

## 使用

前台启动`es`

```bash
elasticsearch
```

启动成功后浏览器访问`http://localhost:9200`，会有 HTTP 基本认证弹窗，username 是`elastic`，password 是`H5VzhJP0txg4Lm9EMSZp`，登录成功后显示如下数据：

```json
{
  "name": "KBgeNNv",
  "cluster_name": "elasticsearch_ldu020",
  "cluster_uuid": "Src22ahwTYy9jVthB8w0DQ",
  "version": {
    "number": "6.2.4",
    "build_hash": "ccec39f",
    "build_date": "2018-04-12T20:37:28.497551Z",
    "build_snapshot": false,
    "lucene_version": "7.2.1",
    "minimum_wire_compatibility_version": "5.6.0",
    "minimum_index_compatibility_version": "5.0.0"
  },
  "tagline": "You Know, for Search"
}
```

加载数据

```bash
curl -u elastic:H5VzhJP0txg4Lm9EMSZp -H 'Content-Type: application/x-ndjson' -XPOST 'localhost:9200/bank/account/_bulk?pretty' --data-binary @./test/datas/accounts.json
```

启动 kibana

```bash
kibana
```

启动成功后浏览器访问`http://localhost:5601`, 用户名: elastic，密码：H5VzhJP0txg4Lm9EMSZp

启动`APM`：

```bash
apm-server -e
```

## 问题

1.  Mac OSX 下使用`brew`安装`elasticsearch`, 并且`elasticsearch`安装`x-pack`插件后，`setup-passwords`命令行工具的路径?

```bash
/usr/local/Cellar/elasticsearch/6.2.4/libexec/bin/x-pack/setup-passwords auto
Initiating the setup of passwords for reserved users elastic,kibana,logstash_system.
The passwords will be randomly generated and printed to the console.
Please confirm that you would like to continue [y/N]y


Changed password for user kibana
PASSWORD kibana = QVT9zQWToZcIpvuC7E3m

Changed password for user logstash_system
PASSWORD logstash_system = 4InacyjidWjYSq4a5jcu

Changed password for user elastic
PASSWORD elastic = H5VzhJP0txg4Lm9EMSZp
```

2.  `kibana.yml`文件路径?

OSX 下通过`brew`安装: `/usr/local/Cellar/kibana/6.2.4/config/kibana.yml`

3.  启动`elasticsearch`服务后，使用`curl`访问`localhost:9200`出现`curl: (52) Empty reply from server`

https://stackoverflow.com/questions/50638174/elasticsearch-cant-access-localhost9200-via-curl/50639089#50639089

4.  `APM`配置文件路径

OSX 下通过`brew`安装: `/usr/local/etc/apm-server/apm-server.yml`

5.  启动`apm-server`时，报 401 错误

```bash
2018-06-05T15:48:15.448+0800	ERROR	pipeline/output.go:74	Failed to connect: 401 Unauthorized: {"error":{"root_cause":[{"type":"security_exception","reason":"missing authentication token for REST request [/]","header":{"WWW-Authenticate":"Basic realm=\"security\" charset=\"UTF-8\""}}],"type":"security_exception","reason":"missing authentication token for REST request [/]","header":{"WWW-Authenticate":"Basic realm=\"security\" charset=\"UTF-8\""}},"status":401}
```

解决方案：

打开`APM`配置文件`/usr/local/etc/apm-server/apm-server.yml`,将`username`和`password`注释打开，并修改`password`密码为问题 1 中生成的密码

```yml
#================================ Outputs =====================================

# Configure what output to use when sending the data collected by the beat.

#-------------------------- Elasticsearch output ------------------------------
output.elasticsearch:
  # Array of hosts to connect to.
  hosts: ["localhost:9200"]

  # Optional protocol and basic auth credentials.
  #protocol: "https"
  username: "elastic"
  password: "H5VzhJP0txg4Lm9EMSZp"
```

## 待办

- [ ] APM node.js agent - Source Map Support 代码演示

## 参考链接

https://elasticsearch.cn/

https://www.elastic.co/guide/en/kibana/current/index.html

https://www.elastic.co/start

https://yq.aliyun.com/articles/285815?spm=a2c0j.9528745.934977.1.21e95a36op6lBZ

https://www.elastic.co/solutions/apm

https://www.elastic.co/downloads/apm

https://github.com/nswbmw/node-in-debugging/blob/master/5.2%20Elastic%20APM.md
