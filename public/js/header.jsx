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

            <div className="nav navbar-nav">
              <li className="active"><Link to="/newThought"><span className="glyphicon glyphicon-cloud gi-2x"></span></Link></li>
            </div>
          </div>

        </nav>
      </div>
    );
  }
});

module.exports = HeaderFrame;
