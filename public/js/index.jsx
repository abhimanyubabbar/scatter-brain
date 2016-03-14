var React = require('react');
var ReactDOM = require('react-dom');
var Header = require('./header.jsx');
var MainThoughtsFrame = require('./thoughts.jsx');

var AppFrame = React.createClass({

  render: function() {
    return (
      <div id="application">
        <Header/>
        <MainThoughtsFrame/>
      </div>
    );
  }
});

// Inject the frame in the container.
ReactDOM.render(
  <AppFrame/>,
  document.getElementById('main')
);
