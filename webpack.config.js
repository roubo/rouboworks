'use strict';

const webpack = require('webpack');
const path = require('path')

let externals = _externals();

module.exports = {
	context: path.resolve(__dirname, ''),
	mode: "development",
	entry: {
        app: './app.js',
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'app.js'
    },
    resolve: {
		extensions: ['.js','.json']
    },

    externals: externals,
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },
    module: {
		rules: [
            {
                test: /\.js$/,
				use: {
					loader: 'babel-loader',
                	options: {
						presets: [['@babel/preset-env', {
							"targets" : {
								"node" : "current"
							}
						}]]
					}
				},
                exclude: /node_modules/
            }
        ]
    },
};

function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}

