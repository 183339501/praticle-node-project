'use strict'

module.exports = function (set,get,has) {
	//服务器监听端口
	set('web.port',3000);
	set("web.session.secret","test");

	//session redis
	set("web.session.redis",{
		host:"127.0.0.1",
		port:6379
	});

	//limit redis connection
	set("limiter.redis",{
		host:"127.0.0.1",
		port:6379,
		prefix:"L:"
	});

	//validcode redis connection
	set("validcode.redis",{
		host:"127.0.0.1",
		port:6379,
		prefix:"V:"
	})
}