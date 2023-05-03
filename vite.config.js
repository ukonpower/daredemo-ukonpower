import path from 'path';
import { defineConfig } from 'vite';
import glslify from 'rollup-plugin-glslify';

const pageList = [
	{ name: 'index', path: '/' },
];

const input = {
	...( () => {

		const exEntryList = {};

		pageList.forEach( ( page ) => {

			exEntryList[ page.name || page.path ] = path.resolve( __dirname, 'src/', page.path, '/index.html' );

		} );

		return exEntryList;

	} )(),
};

export default defineConfig( {
	root: 'src',
	server: {
		port: 3000,
		host: "0.0.0.0",
	},
	publicDir: "public",
	build: {
		outDir: '../public/',
		rollupOptions: {
			input,
			output: {
				dir: './public',
			}
		}
	},
	resolve: {
	},
	plugins: [
		{
			...glslify( {
				basedir: './src/ts/glsl-chunks/',
				transform: [
					[ 'glslify-hex' ],
					[ 'glslify-import' ]
				],
			} ),
			enforce: 'pre'
		}
	]
} );
