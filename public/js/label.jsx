
import React from 'react';
import {CompactPicker} from 'react-color';

var Labels = React.createClass({

  getInitialState : function(){
    return {
      hex : "",
      label: ""
    };
  },

  componentDidMount:function(){
  },

  loadAllLabels:function() {
  },

  addNewLabel:function() {
  },

  labelChange: function(e) {
    this.setState({
      label: e.target.value
    });
  },

  handleColorChange : function(color) {
    this.setState({
      hex: color.hex
    });
  },

  render : function(){
    return(
      <div id="labels">
        <CompactPicker onChangeComplete={this.handleColorChange}></CompactPicker>
        <div className="margin-top-sm">
          <form role="form" id="label-form" className="form-inline">

            <div className="form-group">
              <label htmlFor="hex" className="base-margin">Code</label>
              <input type="text" className="form-control base-margin" id="hex" disabled
                    value={this.state.hex}></input>
            </div>

            <div className="form-group">
              <label htmlFor="label" className="base-margin">Label</label>
              <input type="text" className="form-control base-margin" id="label"
                    value={this.state.label} onChange={this.labelChange}></input>
            </div>

            <button className="btn btn-warning base-margin">Submit</button>
          </form>
        </div>
      </div>
    );
  }

});


module.exports = Labels;
