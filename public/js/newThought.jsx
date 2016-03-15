import React from 'react';


var NewThought = React.createClass({

  render : function() {
    return (
      <form role="thoughtForm">
        <div className="form-group">
          <label for="thought-title">Title</label>
          <input type="text" className="form-control" id="thought-title"></input>
        </div>
        <div className="form-group">
          <label for="thought">Thought</label>
          <textarea className="form-control" id="thought-description"></textarea>
        </div>
        <button className="btn btn-success">Submit</button>
      </form>
    );
  }
});


module.exports = NewThought;
