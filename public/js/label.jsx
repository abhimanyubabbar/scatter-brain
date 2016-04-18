
import React from 'react';
import {CompactPicker} from 'react-color';

var Labels = React.createClass({

  getInitialState : function(){
    return {
      hex : "",
      description: "",
      labels: []
    };
  },

  componentDidMount:function(){
    this.loadAllLabels();
  },

  loadAllLabels:function() {
    console.log("Going to fetch all the labels.");
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

  addNewLabel:function(label) {
    console.log('Going to add a new label in the system.');
    $.ajax({
      url:'api/labels',
      type:'POST',
      contentType:'application/json',
      data: JSON.stringify(label),
      success: function(data) {
        console.log("New label added in system.");
        console.log(data);
        this.setState({
          hex : '',
          description: ''
        });
      }.bind(this),
      error: function(err) {
        console.log("Unable to add new label in system.");
        console.log(err);
      }.bind(this)
    });
  },

  descriptionChange: function(e) {
    this.setState({
      description: e.target.value
    });
  },

  handleColorChange : function(color) {
    this.setState({
      hex: color.hex
    });
  },

  submitLabel : function(e){
    e.preventDefault();
    var description = this.state.description.trim();
    var hex = this.state.hex.trim();
    if (!description || !hex) {
      console.log('Missing mandatory parameters.');
      return;
    }
    this.addNewLabel({
      'hex': hex,
      'description' : description
    });
  },

  render : function(){
    // Prepare the label table rows.
    var labelArray = [];
    var labels = this.state.labels;
    for (var i=0; i < labels.length; i++) {
      labelArray.push(
        <tr>
          <td>{labels[i]['description']}</td>
          <td>{labels[i]['hex']}</td>
        </tr>
      );
    }


    return(
      <div id="labels">
        <CompactPicker onChangeComplete={this.handleColorChange}></CompactPicker>
        <div className="margin-top-sm">
          <form role="form" id="label-form" className="form-inline"
            onSubmit={this.submitLabel}>

            <div className="form-group">
              <label htmlFor="hex" className="base-margin">Code</label>
              <input type="text" className="form-control base-margin" id="hex"
                disabled value={this.state.hex}></input>
            </div>

            <div className="form-group">
              <label htmlFor="label" className="base-margin">Label</label>
              <input type="text" className="form-control base-margin" id="label"
                value={this.state.description}
                onChange={this.descriptionChange}></input>
            </div>

            <button type="submit" className="btn btn-warning base-margin">Submit</button>
          </form>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th> Color Code</th>
              </tr>
            </thead>
            <tbody>
              {labelArray}
            </tbody>
          </table>
        </div>

      </div>
    );
  }

});


module.exports = Labels;
