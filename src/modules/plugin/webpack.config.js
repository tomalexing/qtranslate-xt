// Webpack configuration for qTranslate-XT
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

module.exports = [
	// defaultConfig,
	{
		...defaultConfig,
	    entry: {
            index: "./index.js",
          },
		output: {
			filename: '[name].js',
			path: path.resolve(process.cwd() , 'build'),
		},
		module: {
			rules: [
				{
					test: /\.(j|t)sx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: require.resolve('babel-loader'),
							options: {
								cacheDirectory:
									process.env.BABEL_CACHE_DIRECTORY || true,
								babelrc: false,
								configFile: false,
								presets: [
									[
										'@babel/preset-react',
										 
									],
								],
							},
						},
					],
				},
			],
		},
	 
	},
];