import React from 'react';

var NewThought = React.createClass({

  getInitialState: function(){
    return {
      title: '',
      thought: '',
      labels: [],
      labelId: ''
    };
  },

  componentDidMount: function(){
    $.ajax({
      url: 'api/labels',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        var labels = [];
        for (var i=0; i < data.length; i ++) {
          labels.push(data[i]);
        }
        this.setState({
          labels:labels
        });
      }.bind(this),
      error: function(err) {
        console.log('Unable to fetch the labels' + err);
      }.bind(this)
    });
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
      url: '/api/thought-labels',
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

  onLabelChange : function(val) {
    console.log(val);
    console.log(val.target.value);
  },

  render : function() {

    var labelSelect = [];
    var labels = this.state.labels;
    for(var i=0; i < labels.length; i ++) {
      labelSelect.push(
        <option value={labels[i]['id']}>
          {labels[i]['description']}
        </option>
      );
    }

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

        <div className="form-group">
          <select onChange={this.onLabelChange}>
            {labelSelect}
          </select>
        </div>

        <button className="btn btn-success"
                onClick={this.submitForm}>Submit</button>
      </form>
    );
  }
});

module.exports = NewThought;
