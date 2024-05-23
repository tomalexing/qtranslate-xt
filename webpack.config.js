// Webpack configuration for qTranslate-XT
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

const BROWSERS = [
	'last 2 Chrome versions',
	'last 2 Firefox versions',
	'last 2 Safari versions',
	'> 1%',
	'not last 2 OperaMini versions',
];

const BABEL_LOADER = {
	loader: 'babel-loader',
	options: {
		cacheDirectory:
			process.env.BABEL_CACHE_DIRECTORY || true,
		babelrc: false,
		configFile: false,
		compact: true,
		presets: [
			['@babel/preset-env', {
				targets: {
				  browsers: BROWSERS,
				},
				modules: false,
			  }],
			[
				'@babel/preset-react'
			],
		],
	}

};


defaultConfig.output.path = path.resolve(process.cwd() , 'build-blocks');

module.exports = [
	defaultConfig,
	{
	    entry: {
            main: "./js/main.js",
            "block-editor": "./js/block-editor.js",
            notices: "./js/notices.js",
            options: "./js/options.js",
            "modules/acf": "./js/acf/index.js",
          },
		output: {
			filename: '[name].js',
			path: path.resolve(process.cwd() , 'build'),
		},
		// optimization: {
		// 	minimize: false,
		// 	runtimeChunk: {
		// 		name: 'vendors',
		// 	},
		// 	splitChunks: {
		// 		cacheGroups: {
		// 			vendors: {
		// 				test: /[\\/]node_modules[\\/]/,
		// 				name: 'vendors',
		// 				minSize: 0,
		// 				chunks: 'all',
		// 			},
		// 		},
		// 	},
		// },
		module: {
			// noParse: /plugin/ ,
			rules: [
				{
					test: /\.(j|t)sx?$/,
					exclude: [
						/node_modules/,
						path.resolve(process.cwd() , 'src/modules/plugin/')
					],
					use: [BABEL_LOADER],
				},
			],
		},

		
        // plugins: [
        //     new CopyPlugin({
        //       patterns: [
        //         {
        //           context: path.resolve(process.cwd(), "src"),
        //           from: "modules/blocks/**/render.php",
        //           to: ".",
        //           globOptions: {
        //             dot: false,
        //             gitignore: false
        //           },
        //         },
        //       ],
        //     }),
        // ],
	},

	{
		...defaultConfig,
	    entry: {
            "index": "./index.js",
        },
		context: path.resolve(__dirname, './src/modules/plugin/'),
		output: {
			filename: '[name].js',
			path: path.resolve(process.cwd() , 'src/modules/plugin/build'),
		},
		module: {
			rules: [
				{
					test: /\.(j|t)sx?$/,
					exclude: [
						/node_modules/,
					],
					use: [BABEL_LOADER],
				},
			],
		}

	}
];