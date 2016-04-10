module.exports = {
    entry: './public/js/index.jsx',
    output: {
        filename: 'bundle.js', //this is the default name, so you can skip it
            //at this directory our bundle file will be available
            //make sure port 8090 is used when launching webpack-dev-server
            publicPath: 'http://localhost:8090/assets'
        },
    module: {
            loaders: [
                        {
                            test: /\.jsx$/,
                            exclude: /node_modules/,
                            loader: "babel",
                            query:
                              {
                                      presets:['stage-0','es2015','react']
                              }
                        }

                    ]
        },
    externals: {
            //don't bundle the 'react' npm package with our bundle.js
            //but get it from a global 'React' variable
        },
    resolve: {
            extensions: ['', '.js', '.jsx']
        }
};
