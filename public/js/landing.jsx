import React from 'react';

var Landing = React.createClass({

  getInitialState : function(){
    return {
      thoughts: []
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

  render : function(){

    var divArray = [];
    var thoughts = this.state.thoughts;

    for( var i=0; i < thoughts.length ; i++) {
      divArray.push(
        <h3>{thoughts[i].title}</h3>
      );
    }

    return(
      <div>
        {divArray}
      </div>
    );
  }
});

module.exports = Landing;
