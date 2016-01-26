// Heading Frame.
var HeaderFrame= React.createClass({
    render : function(){
        return(
            <div id="header-frame" className="margin-top:50px">
                <h2 className="heading">Scatter Brain</h2>
            </div>
        );
    }
});


var ModalFrame = React.createClass({

    getInitialState : function(){
        return {title: '', thought: ''};
    },
    submitForm : function(e){
        e.preventDefault();
        var title = this.state.title.trim();
        var thought = this.state.thought.trim();

        if (!title || !thought) {
            return;
        }
        this.props.onThoughtSubmit({title: title, thought: thought});
        this.setState({title:'', thought: ''});
    },
    titleChange : function(e){
        this.setState({title: e.target.value});
    },

    thoughtChange : function(e){
        this.setState({thought : e.target.value});
    },

    render : function(){

        return (
            <div>
                <button className ="btn btn-primary" data-toggle="modal" data-target="#thoughtModal">New Thought</button>
                <div id="thoughtModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>New Thought</h3>
                            </div>
                            <div className="modal-body">
                                <form role="form" id="scatter-form" onSubmit={this.submitForm}>
                                    <div className="form-group">
                                        <label htmlFor="title">TitleUpdated</label>
                                        <input type="text" className="form-control" id="title" value={this.state.title} onChange={this.titleChange}></input>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="thoughts">Scatter</label>
                                        <textarea className="form-control" id="thoughts" value={this.state.thought} onChange={this.thoughtChange}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-warning" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var AppFrame = React.createClass({

    loadAllThoughts : function(){
        console.log("Going to get all thoughts");
        $.ajax ({
            url : 'http://localhost:3000/api/thoughts',
            dataType: 'json',
            success : function(thoughts){
                console.log(thoughts);
            },
            error : function(err){
                console.log(err);
            }
        });
    },

    thoughtSubmit : function (content){

        $.ajax({
            url : 'http://localhost:3000/api/thoughts',
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(content),
            success : function(data){
               console.log(data);
            },
            error : function(err) {
                console.log(err);
            }
        });
    },

    componentDidMount : function(){
        setInterval(this.loadAllThoughts, this.props.pollInterval);
    },


    render : function(){
        return (
            <div id="application">
                <HeaderFrame />
                <ModalFrame thoughtSubmit={this.thoughtSubmit}/>
            </div>
        );
    }
});

// Inject the frame in the container.
ReactDOM.render(
    <AppFrame pollInterval='5000'/>,
    document.getElementById('container')
);
