
var HeaderFrame= React.createClass({
    render : function(){
        return(
            <div id="header-frame" className="margin-top:50px">
                <h2 className="heading">Scatter Brain</h2>
            </div>
        )
    }
})



// Topic Title Frame.
var ScatterFrame = React.createClass({

    render : function(){
        return (
            <div id="form-frame" className="margin-top:50px">
            <form role="form" id="scatter-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title"></input>
                </div>
                <div className="form-group">
                    <label htmlFor="thoughts">Scatter</label>
                    <textarea className="form-control" id="thoughts"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>
        )
    }
})


var AppFrame = React.createClass({

    render : function(){
        return (
            <div id="application">
                <HeaderFrame />
                <ScatterFrame />
            </div>
        )
    }
})

// Inject the frame in the container.
ReactDOM.render(
    <AppFrame />, 
    document.getElementById('container')
);
