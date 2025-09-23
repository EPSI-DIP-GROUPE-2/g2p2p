const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const mode = process.env.NODE_ENV || 'development'

module.exports = {
	mode,
	watch: mode === 'development',
	watchOptions: {
		ignored: ['**/node_modules'],
	},
	target: 'web',
	devtool: mode === 'development' ? 'inline-source-map' : false,
	entry: {
		styles: path.resolve(__dirname, './static/assets/styles/globals.scss'),
	},
	output: {
		path: path.resolve(__dirname, './static/assets/dist'),
		filename: '[name].js', // JS file is required by webpack but will be empty
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.scss$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css', // outputs dist/styles.css
		}),
	],
}
