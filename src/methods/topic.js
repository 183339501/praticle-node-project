/**
 * Created by pengyao on 16/5/15.
 */
'use strict';
import validator from "validator";

module.exports = function (done) {

    $.method("topic.add").check({
        authorId : {required:true,validate : (v) => validator.isMongoId(v)},
        title: {required:true},
        content : {required:true},
        tags : {validate:(v) =>  Array.isArray(v)}
    });
    //发表帖子
    $.method("topic.add").register(async function (params) {
        const topic = new $.model.Topic(params);
        topic.createdAt = new Date();
        return topic.save();
    });


    $.method("topic.get").check({
        _id : {required:true,validate : (v) => validator.isMongoId(v)}
    });

    //获得单个帖子
    $.method("topic.get").register(async function (params) {
        return $.model.Topic.findOne({_id : params._id});
    });

    $.method("topic.list").check({
        authorId : {validate : (v) => validator.isMongoId(v)},
        tags : {validate : (v) => Array.isArray(v)},
        skip : {validate:(v) => v >= 0},
        limit: {validate:(v) => v > 0}
    });

    //帖子列表
    $.method("topic.list").register(async function (params) {
        const query = {};
        if (params.authorId) query.authorId = params.authorId
        if(params.tags) query.tags = {$all:params.tags};
        const ret = $.model.Topic.find(query,{
            authorId:1,
            title:1,
            createdAt:1,
            updatedAt :1,
            lastCommentedAt:1
        });

        if(params.skip) ret.skip(Number(params.skip));

        if(params.limit) ret.limit(Number(params.limit))

        return ret
    });

    $.method("topic.delete").check({
        _id : {required:true,validate : (v) => validator.isMongoId(v)}
    });

    //删除帖子
    $.method("topic.delete").register(async function (params) {
        return $.model.Topic.remove({_id:params._id});
    });

    $.method("topic.update").check({
        _id : {required:true,validate : (v) => validator.isMongoId(v)},
        tags : {validate : (v) => Array.isArray(v)}
    });

    //更新帖子
    $.method("topic.update").register(async function (params) {
        const update = {updatedAt:new Date()}
        if(params.title) update.title = params.title;
        if(params.content) update.content = params.content;
        if(params.tags) update.tags = params.tags;
        return $.model.Topic.update({_id:params._id},{$set:update});
    });

    $.method("topic.comment.add").check({
        _id : {required:true,validate : (v) => validator.isMongoId(v)},
        authorId : {required:true,validate : (v) => validator.isMongoId(v)},
        content : {required:true}
    });

    //增加评论
    $.method("topic.comment.add").register(async function (params) {
        const comment = {
            cid : new $.utils.ObjectId(),
            authorId : params.authorId,
            content : params.content,
            createdAt : new Date()
        };

        return $.model.Topic.update({_id:params._id},{$push:{comments:comment}})
    });
    $.method("topic.comment.get").check({
        _id : {required:true,validate : (v) => validator.isMongoId(v)},
        cid : {required:true,validate : (v) => validator.isMongoId(v)}
    });

    //获取评论
    $.method("topic.comment.get").register(async function (params) {


        return $.model.Topic.findOne({_id:params._id,'comments._id':params.cid},
            {
                'comments.$':1
            })
    });

    $.method("topic.comment.delete").check({
        _id : {required:true,validate : (v) => validator.isMongoId(v)},
        cid : {required:true,validate : (v) => validator.isMongoId(v)}
    });

    //删除评论
    $.method("topic.comment.delete").register(async function (params) {

        return $.model.Topic.update({_id:params._id},{$pull:
            {
                _id:params.cid
            }
        })
    });

    done();
}