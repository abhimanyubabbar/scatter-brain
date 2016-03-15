import React from 'react';
import ReactDOM from 'react-dom';
import Header from './header.jsx';
import NewThought from './newThought.jsx';
import Landing from './landing.jsx';
import {Router, Route, IndexRoute} from 'react-router';

var App = React.createClass({

  render: function() {
    return (
      <div id="application">
        <Header/>
        {this.props.children}
      </div>
    );
  }
});

// Inject the frame in the container.
ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Landing}/>
      <Route path="newThought" component={NewThought}/>
    </Route>
  </Router>,
  document.getElementById('main')
);
