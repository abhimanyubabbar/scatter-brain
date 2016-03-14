var React = require('react');

var HeaderFrame  = React.createClass({

  render : function(){
    return(
      <div id="header">
        <nav className="navbar navbar-inverse">

          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand heading" href="#">Scatter Brain</a>
            </div>

            <div className="nav navbar-nav">
              <li className="active"><a href="#"><span className="glyphicon glyphicon-cloud gi-2x"></span></a></li>
            </div>
          </div>

        </nav>
      </div>
    )
  }
});

module.exports = HeaderFrame;