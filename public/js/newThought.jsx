import React from 'react';

var NewThought = React.createClass({

  getInitialState: function(){
    return {
      title: '',
      thought: ''
    };
  },

  submitForm : function(e){
    e.preventDefault();
    var title = this.state.title.trim();
    var thought = this.state.thought.trim();

    if (!title || !thought) {
      console.log("Unable to submit empty form.");
      return;
    }

    this.addNewThought({
      title : title,
      thought: thought
    });
  },

  // Update the state with the change in
  // title.
  titleChange: function(e) {
    this.setState({
      title: e.target.value
    });
  },

  // Update the thought value wit update
  // in the front end.
  thoughtChange: function(e) {
    this.setState({
      thought: e.target.value
    });
  },

  // Add a new thought in the system.
  addNewThought: function(content) {

    console.log("Going to add a new thought");
    console.log(content);

    $.ajax({
      url: '/api/thoughts',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(content),
      success: function() {
        this.setState({
          title:'',
          thought:''
        });
      }.bind(this),
      error: function(err) {
        console.log(err);
      }
    });
  },

  render : function() {
    return (
      <form role="thoughtForm">
        <div className="form-group">
          <label htmlFor="thought-title">Title</label>
          <input type="text" className="form-control"
                 id="thought-title" value={this.state.title}
                 onChange={this.titleChange}></input>
        </div>

        <div className="form-group">
         <label htmlFor="thought-description">Thought</label>
         <textarea className="form-control"
                   id="thought-description" value={this.state.thought}
                   onChange={this.thoughtChange}></textarea>
        </div>

        <button className="btn btn-success"
                onClick={this.submitForm}>Submit</button>
      </form>
    );
  }
});

module.exports = NewThought;
