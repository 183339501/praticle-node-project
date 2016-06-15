'use strict'

import request from "supertest";
import "./base"

// 清空Redis数据
$.init.add(done => {
    $.limiter.connection.keys($.config.get('limiter.redis.prefix') + '*', (err, keys) => {
        if (err) return done(err);
        if (keys.length > 0) {
            $.limiter.connection.del(keys, done);
        } else {
            done();
        }
    });
});

$.init.add(done => {
    $.validcode.connection.keys($.config.get('validcode.redis.prefix') + '*', (err, keys) => {
        if (err) return done(err);
        if (keys.length > 0) {
            $.validcode.connection.del(keys, done);
        } else {
            done();
        }
    });
});

//清空数据库
$.init.add(done=>{
    $.mongodb.db.dropDatabase(done);
});

$.init.add(async function () {
    const data = require('./test.db');
    for (const name in data) {
        for (const item of data[name]) {
            await $.mongodb.db.collection(name).save(item);
        }
    }
});

$.init((err) => {
    if(err) {
        console.log(err);
        process.exit(-1);
    } else {
        console.log("init");
    }
});

function makeRequest(method,path,params){
    return new Promise((resolve,reject)=>{
        $.ready(()=>{
            params = params||{};
            let req = request($.express)[method](path);
            if(method==='get'||method==='head'){
                req = req.query(params);
            } else {
                req = req.send(params);
            }

            req.expect(200).end((err, res) => {
                if (err) return reject(err);

                if (res.body.success) {
                    resolve(res.body.result);
                } else {
                    reject(new Error(res.body.error));
                }
            });
        })
    })
}

function generateRequestMethod(method){
    return function (path,params) {
        return makeRequest(method,path,params);
    }
}

export default  {
    get : generateRequestMethod("get"),
    post : generateRequestMethod("post"),
    put : generateRequestMethod("put"),
    delete : generateRequestMethod("delete")
}