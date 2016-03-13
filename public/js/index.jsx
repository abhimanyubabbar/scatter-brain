var React = require('react');
var ReactDOM = require('react-dom');

// Heading Frame.
var HeaderFrame = React.createClass({
  render: function() {
    return (
      <div id="header-frame" className="margin-top:50px">
        <h2 className="heading">Scatter Brain</h2>
      </div>
    );
  }
});


// Main frame for dealing with all the activities related
// to the thoughts added by a user.
var MainThoughtsFrame = React.createClass({

  getInitialState: function(){
    return{
      thoughts: []
    };
  },

  componentDidMount: function() {
    this.loadAllThoughts();
  },

  replaceThoughtsArray: function(data){
    this.setState({
      thoughts: data
    });
  },

  appendToThoughts: function(thought) {

    var existingThoughts = this.state.thoughts;
    existingThoughts.push(thought);
    this.setState({
      thoughts: existingThoughts
    });

    console.log(this.state.thoughts);
  },

  loadAllThoughts: function() {

    var replace = this.replaceThoughtsArray;

    $.ajax({
      url: '/api/thoughts',
      dataType: 'json',
      success: function(data) {

        console.log(data);
        var thoughts = [];
        for (var i=0; i< data.length; i++) {
          thoughts.push(data[i]);
        }

        replace(data);
      },

      error: function(err) {
        console.log(err);
      }
    });
  },

  addNewThought: function(content) {

    var append = this.appendToThoughts;

    $.ajax({
      url: '/api/thoughts',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(content),
      success: function(data) {
        console.log("Added a new thought in the system.");
        append(data);

      },
      error: function(err) {
        console.log(err);
      }
    });
  },

  render : function(){
    return(
      <div id="main">
        <ThoughtsViewFrame thoughts= {this.state.thoughts}/>
        <NewThoughtsFrame addNewThought={this.addNewThought}/>
      </div>
    );
  }

});


// Frame dealing with the display of all the
// thoughts in the system.
var ThoughtsViewFrame = React.createClass({

  getInitialState: function(){
    return{
      thoughtDivs: []
    };
  },

  render : function(){
    var divArray = [];
    var thoughts = this.props.thoughts;
    console.log(thoughts);

    for( var i=0; i < thoughts.length ; i++) {
      divArray.push(
        <h3>{thoughts[i].title}</h3>
      );
    }

    return(
      <div>
        <h3>Thought List</h3>
        {divArray}
      </div>
    );
  }
});

var NewThoughtsFrame = React.createClass({

  getInitialState: function() {
    return {
      title: '',
      thought: ''
    };
  },
  submitForm: function(e) {

    e.preventDefault();
    var title = this.state.title.trim();
    var thought = this.state.thought.trim();

    if (!title || !thought) {
      return;
    }

    this.props.addNewThought({
      title: title,
      thought: thought
    });
    this.setState({
      title: '',
      thought: ''
    });
  },
  titleChange: function(e) {
    this.setState({
      title: e.target.value
    });
  },

  thoughtChange: function(e) {
    this.setState({
      thought: e.target.value
    });
  },

  render: function() {

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
                              <label htmlFor="title">Title</label>
                              <input type="text" className="form-control"
                                id="title" value={this.state.title}
                                onChange={this.titleChange}>
                              </input>
                          </div>

                          <div className="form-group">
                              <label htmlFor="thoughts">Scatter Thought</label>
                              <textarea className="form-control"
                                id="thoughts" value={this.state.thought}
                                onChange={this.thoughtChange}>
                              </textarea>
                          </div>

                      </form>
                  </div>

                  <div className="modal-footer">
                      <button type="submit" className="btn btn-primary" onClick={this.submitForm}>Submit</button>
                      <button className="btn btn-warning" data-dismiss="modal">Close</button>
                  </div>

                </div> {/*modal content end.*/}
            </div> {/*modal dialog end.*/}
         </div> {/*modal main end.*/}

      </div>
    );
  }
});

var AppFrame = React.createClass({

  render: function() {
    return (
      <div id="application">
        <HeaderFrame/>
        <MainThoughtsFrame/>
      </div>
    );
  }
});

// Inject the frame in the container.
ReactDOM.render(
  <AppFrame/>,
  document.getElementById('container')
);
