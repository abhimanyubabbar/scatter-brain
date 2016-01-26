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
	var HeaderFrame= React.createClass({displayName: "HeaderFrame",
	    render : function(){
	        return(
	            React.createElement("div", {id: "header-frame", className: "margin-top:50px"}, 
	                React.createElement("h2", {className: "heading"}, "Scatter Brain")
	            )
	        );
	    }
	});


	var ModalFrame = React.createClass({displayName: "ModalFrame",

	    getInitialState : function(){
	        return {title: '', thought: ''};
	    },
	    submitForm : function(e){
	        e.preventDefault();
	        var title = this.state.title.trim();
	        var thought = this.state.thought.trim();

	        if (!title || !thought) {
	            return;
	        }
	        this.props.onThoughtSubmit({title: title, thought: thought});
	        this.setState({title:'', thought: ''});
	    },
	    titleChange : function(e){
	        this.setState({title: e.target.value});
	    },

	    thoughtChange : function(e){
	        this.setState({thought : e.target.value});
	    },

	    render : function(){

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
	                                        React.createElement("label", {htmlFor: "title"}, "TitleUpdated"), 
	                                        React.createElement("input", {type: "text", className: "form-control", id: "title", value: this.state.title, onChange: this.titleChange})
	                                    ), 
	                                    React.createElement("div", {className: "form-group"}, 
	                                        React.createElement("label", {htmlFor: "thoughts"}, "Scatter"), 
	                                        React.createElement("textarea", {className: "form-control", id: "thoughts", value: this.state.thought, onChange: this.thoughtChange})
	                                    ), 
	                                    React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Submit")
	                                )
	                            ), 

	                            React.createElement("div", {className: "modal-footer"}, 
	                                React.createElement("button", {className: "btn btn-warning", "data-dismiss": "modal"}, "Close")
	                            )
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	var AppFrame = React.createClass({displayName: "AppFrame",

	    loadAllThoughts : function(){
	        console.log("Going to get all thoughts");
	        $.ajax ({
	            url : 'http://localhost:3000/api/thoughts',
	            dataType: 'json',
	            success : function(thoughts){
	                console.log(thoughts);
	            },
	            error : function(err){
	                console.log(err);
	            }
	        });
	    },

	    thoughtSubmit : function (content){

	        $.ajax({
	            url : 'http://localhost:3000/api/thoughts',
	            type : 'POST',
	            contentType : 'application/json',
	            data : JSON.stringify(content),
	            success : function(data){
	               console.log(data);
	            },
	            error : function(err) {
	                console.log(err);
	            }
	        });
	    },

	    componentDidMount : function(){
	        setInterval(this.loadAllThoughts, this.props.pollInterval);
	    },


	    render : function(){
	        return (
	            React.createElement("div", {id: "application"}, 
	                React.createElement(HeaderFrame, null), 
	                React.createElement(ModalFrame, {thoughtSubmit: this.thoughtSubmit})
	            )
	        );
	    }
	});

	// Inject the frame in the container.
	ReactDOM.render(
	    React.createElement(AppFrame, {pollInterval: "5000"}),
	    document.getElementById('container')
	);


/***/ }
/******/ ]);