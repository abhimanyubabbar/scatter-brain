var Modal = require('react-modal');

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


const customStyles = {
  content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
};


var ModalFrame = React.createClass({

    getInitialState : function(){
        return {modalIsOpen : false};
    },
    openModal : function(){
        this.setState({modalIsOpen : true});
    },

    closeModal : function(){
        this.setState({modalIsOpen : false});
    },

    render : function(){

        return (
            <div>
                <button className ="btn btn-primary" onClick={this.openModal}>New Thought</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}>

                    <FormFrame onThoughtSubmit = {this.props.thoughtSubmit}/>
                </Modal>
            </div>
        );
    }
});

// Form for submission.
var FormFrame = React.createClass({
    getInitialState : function(){
        return {title: '', thought: ''};
    },
    titleChange : function(e){
        this.setState({title: e.target.value});
    },

    thoughtChange : function(e){
        this.setState({thought : e.target.value});
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

    render : function(){
        return (
            <div id="form-frame" className="margin-top:50px">
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
        );
    }
});


var AppFrame = React.createClass({

    loadAllThoughts : function(){
        console.log("Going to get all thoughts");
        $.ajax ({
            url : 'http://localhost:8080/api/thoughts',
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
            url : 'http://localhost:8080/api/thoughts',
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
