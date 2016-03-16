var React = require('react');
import {Link} from 'react-router';

var HeaderFrame  = React.createClass({

  render : function(){
    return(
      <div id="header">
        <nav className="navbar navbar-inverse">

          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand heading" href="#">Scatter Brain</a>
            </div>

            <ul className="nav navbar-nav">
              <li><Link to="/newThought"><span className="glyphicon glyphicon-cloud gi-2x"></span></Link></li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/labels"><span className="glyphicon glyphicon-tags gi-2x"></span></Link></li>
            </ul>
          </div>

        </nav>
      </div>
    );
  }
});

module.exports = HeaderFrame;
