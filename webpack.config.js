
const fs = require('fs'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

// set up a new instance of the extract text plugin,
// pass in an output path for the data it captures
const extractSass = new ExtractTextPlugin('dist/main.css');

// fetch each item in the `.src/` directory
const srcItems = fs.readdirSync('./src');

// set an empty array that will store all entry files
let entriesArray = [
	'./src/styles.scss'
];

// loop over each item
srcItems.forEach(item => {

	// find directories within the `.src/` directory
	if(fs.lstatSync(`./src/${item}`).isDirectory()) {

		// find files in each directory
		const files = fs.readdirSync(`./src/${item}`);

		// find the index file in each directory
		const indexFile = files.find(file => /^index\.(ts|js)$/.test(file));

		// if one was found, add it to the entry files array
		if(indexFile) {
			entriesArray.push(`./src/${item}/${indexFile}`);
		}
	}
});

module.exports = {
	// use the entries array to list all of the entry points
	entry: entriesArray,
	output: {
		filename: 'dist/main.js'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['es2015']
				}
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			},
			{
				test: /\.scss/,
				loader: extractSass.extract(
					['css-loader', {
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}]
				)
			}
		]
	},
	plugins: [
		extractSass
	],
	devServer: {
		port: 9000
	}
};

