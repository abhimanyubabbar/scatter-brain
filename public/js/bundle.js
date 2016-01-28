/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8090/assets";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/** @jsx React.DOM */// Heading Frame.
	var HeaderFrame = React.createClass({displayName: "HeaderFrame",
	  render: function() {
	    return (
	      React.createElement("div", {id: "header-frame", className: "margin-top:50px"}, 
	        React.createElement("h2", {className: "heading"}, "Scatter Brain")
	      )
	    );
	  }
	});


	// Main frame for dealing with all the activities related
	// to the thoughts added by a user.
	var MainThoughtsFrame = React.createClass({displayName: "MainThoughtsFrame",

	  getInitialState: function(){
	    return{
	      thoughts: []
	    };
	  },

	  componentDidMount: function() {
	    this.loadAllThoughts();
	  },

	  replaceThoughtsArray: function(data){
	    this.setState({
	      thoughts: data
	    });
	  },

	  appendToThoughts: function(thought) {

	    var existingThoughts = this.state.thoughts;
	    existingThoughts.push(thought);
	    this.setState({
	      thoughts: existingThoughts
	    });

	    console.log(this.state.thoughts);
	  },

	  loadAllThoughts: function() {

	    var replace = this.replaceThoughtsArray;

	    $.ajax({
	      url: '/api/thoughts',
	      dataType: 'json',
	      success: function(data) {

	        console.log(data);
	        var thoughts = [];
	        for (var i=0; i< data.length; i++) {
	          thoughts.push(data[i]);
	        }

	        replace(data);
	      },

	      error: function(err) {
	        console.log(err);
	      }
	    });
	  },

	  addNewThought: function(content) {

	    var append = this.appendToThoughts;

	    $.ajax({
	      url: '/api/thoughts',
	      type: 'POST',
	      contentType: 'application/json',
	      data: JSON.stringify(content),
	      success: function(data) {
	        console.log("Added a new thought in the system.");
	        append(data);

	      },
	      error: function(err) {
	        console.log(err);
	      }
	    });
	  },

	  render : function(){
	    return(
	      React.createElement("div", {id: "main"}, 
	        React.createElement(ThoughtsViewFrame, {thoughts: this.state.thoughts}), 
	        React.createElement(NewThoughtsFrame, {addNewThought: this.addNewThought})
	      )
	    );
	  }

	});


	// Frame dealing with the display of all the
	// thoughts in the system.
	var ThoughtsViewFrame = React.createClass({displayName: "ThoughtsViewFrame",

	  getInitialState: function(){
	    return{
	      thoughtDivs: []
	    };
	  },

	  render : function(){
	    var divArray = [];
	    var thoughts = this.props.thoughts;
	    console.log(thoughts);

	    for( var i=0; i < thoughts.length ; i++) {
	      divArray.push(
	        React.createElement("h3", null, thoughts[i].title)
	      );
	    }

	    return(
	      React.createElement("div", null, 
	        React.createElement("h3", null, "Thought List"), 
	        divArray
	      )
	    );
	  }
	});

	var NewThoughtsFrame = React.createClass({displayName: "NewThoughtsFrame",

	  getInitialState: function() {
	    return {
	      title: '',
	      thought: ''
	    };
	  },
	  submitForm: function(e) {

	    e.preventDefault();
	    var title = this.state.title.trim();
	    var thought = this.state.thought.trim();

	    if (!title || !thought) {
	      return;
	    }

	    this.props.addNewThought({
	      title: title,
	      thought: thought
	    });
	    this.setState({
	      title: '',
	      thought: ''
	    });
	  },
	  titleChange: function(e) {
	    this.setState({
	      title: e.target.value
	    });
	  },

	  thoughtChange: function(e) {
	    this.setState({
	      thought: e.target.value
	    });
	  },

	  render: function() {

	    return (
	      React.createElement("div", null, 
	        React.createElement("button", {className: "btn btn-primary", "data-toggle": "modal", "data-target": "#thoughtModal"}, "New Thought"), 
	        React.createElement("div", {id: "thoughtModal", className: "modal fade", role: "dialog"}, 
	            React.createElement("div", {className: "modal-dialog modal-lg"}, 
	                React.createElement("div", {className: "modal-content"}, 

	                  React.createElement("div", {className: "modal-header"}, 
	                      React.createElement("h3", null, "New Thought")
	                  ), 

	                  React.createElement("div", {className: "modal-body"}, 
	                      React.createElement("form", {role: "form", id: "scatter-form", onSubmit: this.submitForm}, 
	                          React.createElement("div", {className: "form-group"}, 
	                              React.createElement("label", {htmlFor: "title"}, "Title"), 
	                              React.createElement("input", {type: "text", className: "form-control", 
	                                id: "title", value: this.state.title, 
	                                onChange: this.titleChange}
	                              )
	                          ), 

	                          React.createElement("div", {className: "form-group"}, 
	                              React.createElement("label", {htmlFor: "thoughts"}, "Scatter Thought"), 
	                              React.createElement("textarea", {className: "form-control", 
	                                id: "thoughts", value: this.state.thought, 
	                                onChange: this.thoughtChange}
	                              )
	                          )

	                      )
	                  ), 

	                  React.createElement("div", {className: "modal-footer"}, 
	                      React.createElement("button", {type: "submit", className: "btn btn-primary", onClick: this.submitForm}, "Submit"), 
	                      React.createElement("button", {className: "btn btn-warning", "data-dismiss": "modal"}, "Close")
	                  )

	                ), " "/*modal content end.*/
	            ), " "/*modal dialog end.*/
	         ), " "/*modal main end.*/

	      )
	    );
	  }
	});

	var AppFrame = React.createClass({displayName: "AppFrame",

	  render: function() {
	    return (
	      React.createElement("div", {id: "application"}, 
	        React.createElement(HeaderFrame, null), 
	        React.createElement(MainThoughtsFrame, null)
	      )
	    );
	  }
	});

	// Inject the frame in the container.
	ReactDOM.render(
	  React.createElement(AppFrame, null),
	  document.getElementById('container')
	);


/***/ }
/******/ ]);