/**
 * Created by pengyao on 16/5/29.
 */
import React from "react";
import jQuery from "jquery";


export default class TopicEditor extends React.Component{
    constructor(props) {
        super(props);
        this.state = props.topic||{}
    }
    handleChange(name,e){
        this.state[name] = e.target.value;
    }
    handlePost(e){
        const $btn = jQuery(e.target);
        $btn.button('loading');
        this.props.onSave(this.state,()=>{
            $btn.button("reset");
        });
    }
    render(){
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">{this.props.title}</div>
                <div className="panel-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="title">标题</label>
                            <input type="text" className="form-control" id="title" placeholder="标题" onChange={this.handleChange.bind(this,"title")}/>
                        </div>
                        <div class="form-group">
                            <label htmlFor="tags">标签</label>
                            <input type="text" className="form-control" id="tags" placeholder="标签" onChange={this.handleChange.bind(this,"tags")}/>
                            <p className="help-block">多个标签使用半角逗号分隔</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">内容</label>
                            <textarea row="10" onChange={this.handleChange.bind(this,"content")} className="form-control"></textarea>

                        </div>
                        <button type="button" className="btn btn-primary" onClick={this.handlePost.bind(this)}>发表</button>
                    </form>
                </div>
            </div>
        )
    }
}