import React from 'react';

var Landing = React.createClass({

  getInitialState : function(){
    return {
      thoughts: [],
      currentThought: ''
    };
  },

  componentDidMount : function(){
    this.loadAllThoughts();
  },

  loadAllThoughts : function(){
    $.ajax({
      url: '/api/thoughts',
      dataType: 'json',
      success: function(data) {
        console.log("Received thought array");
        var thoughts = [];
        for (var i=0; i< data.length; i++) {
          thoughts.push(data[i]);
        }
        this.setState({
          thoughts:thoughts
        });
      }.bind(this),

      error: function(err) {
        console.log(err);
      }.bind(this)
    });
  },

  handleClick : function(key){
    console.log('click event fired');
    var thoughts = this.state.thoughts;
    var thought = null;
    for (var i=0; i < thoughts.length; i++) {
      if (thoughts[i].id === key) {
        thought = thoughts[i];
      }
    }
    var currentThought = (thought === null) ? '' : thought.content;
    console.log(thought);
    console.log(currentThought);
    this.setState({
        currentThought: currentThought
    });
  },

  render : function(){

    var titleArray = [];
    var thoughts = this.state.thoughts;
    var currentThought = this.state.currentThought;

    for( var i=0; i < thoughts.length ; i++) {
      var boundClick = this.handleClick.bind(this, thoughts[i].id);
      titleArray.push(
        <div>
          <a onClick={boundClick} key={thoughts[i].id}>{thoughts[i].title}</a>
        </div>
      );
    }

    return(
      <div>
        <div className='col-xs-12 col-md-6'>
          {titleArray}
        </div>
        <div className='col-xs-12 col-md-6'>
          {currentThought}
        </div>
      </div>
    );
  }
});

module.exports = Landing;
