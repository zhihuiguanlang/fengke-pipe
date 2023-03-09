# 智慧管廊
# 项目咨询-联系QQ：2521380

## 登录认证
### 一、登录
http://127.0.0.1:8066
admin/admin

### 二、访问后端api需带上token
放header方式：
Authorization:Bearer xxx

放参数方式：
http://localhost:9900/api-user/users?access_token=xxx


### 三、后端api方法不做认证方式
pipe:
  security:
    ignore:
      httpUrls: '不想认证拦截的url'


 

### 四、获取当前登录人对象
请求的方法参数SysUser上添加该注解，则注入当前登录人信息
//例1：只有id、username 和 roles
public void test(@LoginUser SysUser user)
​
//例2：能获取SysUser对象的所有信息
public void test(@LoginUser(isFull = true) SysUser user)
 

### 五、认证token类型切换
本项目token类型支持3种方式：db、redis、jwt
其中因为jwt使用的是非对称加密，所以认证服务(pipe-uaa)需要配置为authJwt为私钥加密，其他服务(例如网关)配置为resJwt为公钥解密；
pipe.oauth2.token.store.type变量即可改变

例如现在为jwt方式，需要修改为redis方式，只修改pipe-uaa和sc-gateway的pipe.oauth2.token.store.type变量为redis即可
 

### 六、token自动续签
目前续签功能只支持redis token模式，请先确保授权服务器和认证服务器的pipe.oauth2.token.store.type=redis
认证服务器开启自动续签功能pipe.security.auth.renew.enable=true
白名单与非名单功能是非必填项，不配置默认所有应用的token都会续签


自动续签原理：系统设计-认证设计-token自动续签设计


八、url级权限
该功能默认关闭，开启需要在网关添加url权限相关配置


8.1. 打开网关认证配置
pipe.security.auth.urlPermission.enable设置为true

8.2. 配置只认证登录，登录后所有角色都能访问的url(可选项)
pipe.security.auth.urlPermission.ignoreUrls

8.3. 配置白名单/黑名单(可选项)
pipe.security.auth.urlPermission.includeClientIds
pipe.security.auth.urlPermission.exclusiveClientIds


## 智慧管廊开发环境准备
### 前期准备
maven配置阿里云镜像，修改settings.xml文件在mirrors块里添加以下内容
```html
<mirror>  
    <id>alimaven</id>  
    <name>aliyun maven</name>  
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>  
    <mirrorOf>central</mirrorOf>          
</mirror>
```
1. 在idea安装lombok插件

2. 准备好数据库5.7

3. 初始化数据库

4. 脚本路径：pipe-doc/sql

5. Redis

6. 注册中心Nacos
```
	##### Windows直接运行下面的文件
	startup.cmd
	##### Linux/Unix/Mac系统默认是集群模式，所以需要添加standalone改为单机模式
	sh startup.sh -m standalone
	启动命令地址：pipe-register\nacos\bin
	确保机器已经有 JDK1.8 的运行环境，可以通过 java -version 命令检查
```


7. 修改pipe-config/src/main/resources/application-dev.properties里面的配置参数

	- 数据库配置
	- redis配置
	- elasticsearch配置
	 	 	非必须，如果不启用日志功能可不管
	- sentinel配置
			非必须，主要是用于展示应用吞吐量
 

## 智慧管廊项目部署

# 部署
```lua
nohup java -jar target/sc-gateway.jar >> /home/log/sc-gateway-$(date +%Y-%m-%d).log 2>&1 &
nohup java -jar pipe-uaa/target/pipe-uaa.jar  >> /home/log/uaa-$(date +%Y-%m-%d).log 2>&1 &
nohup java -jar pipe-business/user-center/target/user-center.jar   >> /home/log/user-center-$(date +%Y-%m-%d).log 2>&1 &
nohup java -jar pipe-business/ops-center/target/ops-center.jar  >> /home/log/ops-center-$(date +%Y-%m-%d).log 2>&1 &
nohup java -jar pipe-business/device-center/target/device-center.jar  >> /home/log/device-center-$(date +%Y-%m-%d).log 2>&1 &
nohup java -jar pipe-business/assets-center/target/assets-center.jar  >> /home/log/assets-center-$(date +%Y-%m-%d).log 2>&1 &
```
## 智慧管廊项目结构
```lua
pipe-platform -- 父项目，公共依赖
│  ├─pipe-business -- 业务模块一级工程
│  │  ├─user-center -- 用户中心[7000]
│  │  ├─file-center -- 文件中心[5000]
│  │  ├─device-center -- 设备中心[7202]
│  │  ├─ops-center -- 运维中心[7201]
│  │  ├─assets-center -- 资产中心[7203]
│  │  ├─code-generator -- 代码生成器[7300]
│  │  ├─search-center -- 搜索中心
│  │  │  ├─search-client -- 搜索中心客户端
│  │  │  ├─search-server -- 搜索中心服务端[7100]
│  │  ├─sso-center -- 搜索中心
│  │  │  ├─web-sso -- sso前端
│  │  │  ├─ss-sso -- sso单点登录
│  │─pipe-commons -- 通用工具一级工程
│  │  ├─pipe-auth-client-spring-boot-starter -- 封装spring security client端的通用操作逻辑
│  │  ├─pipe-common-core -- 封装通用操作逻辑
│  │  ├─pipe-common-spring-boot-starter -- 封装通用操作逻辑
│  │  ├─pipe-db-spring-boot-starter -- 封装数据库通用操作逻辑
│  │  ├─pipe-log-spring-boot-starter -- 封装log通用操作逻辑
│  │  ├─pipe-redis-spring-boot-starter -- 封装Redis通用操作逻辑
│  │  ├─pipe-ribbon-spring-boot-starter -- 封装Ribbon和Feign的通用操作逻辑
│  │  ├─pipe-sentinel-spring-boot-starter -- 封装Sentinel的通用操作逻辑
│  │  ├─pipe-swagger2-spring-boot-starter -- 封装Swagger通用操作逻辑
│  ├─pipe-config -- 配置中心
│  ├─pipe-gateway -- api网关一级工程
│  │  ├─sc-gateway -- spring-cloud-gateway[9900]
│  ├─pipe-monitor -- 监控一级工程
│  │  ├─sc-admin -- 应用监控[6500]
│  │  ├─log-center -- 日志中心[7200]
│  ├─pipe-uaa -- spring-security认证中心[8000]
│  ├─pipe-register -- 注册中心Nacos[8848]

```
