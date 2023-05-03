import * as THREE from 'three';
import * as ORE from 'ore-three';

import faceVert from './shaders/face.vs';
import faceFrag from './shaders/face.fs';

export class Face extends THREE.Mesh {

	private commonUniforms: ORE.Uniforms;

	private videoElm: HTMLElement;
	private videoTexture: THREE.VideoTexture;
	private maskTexture: THREE.Texture;

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	constructor( videoElm: HTMLVideoElement, parentUniforms: ORE.Uniforms ) {

		let videoTexture = new THREE.VideoTexture( videoElm );

		let commonUniforms = ORE.UniformsLib.mergeUniforms( parentUniforms, {
			uTex: {
				value: videoTexture
			},
			uMaskTex: {
				value: null
			}
		} );

		let geo = new THREE.PlaneGeometry( 1.0, 1.0 );
		let mat = new THREE.ShaderMaterial( {
			vertexShader: faceVert,
			fragmentShader: faceFrag,
			uniforms: commonUniforms,
			transparent: true,
		} );

		super( geo, mat );

		this.commonUniforms = commonUniforms;

		this.videoElm = videoElm;
		this.videoTexture = videoTexture;

		/*-------------------------------
			Canvas
		-------------------------------*/

		this.canvas = document.createElement( "canvas" );
		this.canvas.width = 256;
		this.canvas.height = 256;

		this.ctx = this.canvas.getContext( "2d" )!;

		this.maskTexture = new THREE.Texture( this.canvas );
		this.commonUniforms.uMaskTex.value = this.maskTexture;

		// document.body.appendChild( this.canvas );

	}

	private drawArray = [
		{ s: 36, e: 40 },
		{ s: 42, e: 47 },
		{ s: 48, e: 60 },
		// { s: 27, e: 33 },
		// { s: 17, e: 21 },
		// { s: 22, e: 26 },
	]

	public updateMask( landMarks: any ) {

		let width = 512;
		let height = 512;

		let positions = landMarks.positions;

		this.ctx.fillStyle = "#000";
		this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

		for ( let i = 0; i < this.drawArray.length; i ++ ) {

			let item = this.drawArray[ i ];

			this.ctx.beginPath();

			let ps = positions[ item.s ];

			this.ctx.moveTo( ps.x / width * this.canvas.width, ps.y / height * this.canvas.height );

			for ( let j = item.s + 1; j <= item.e; j ++ ) {

				let p = positions[ j ];

				this.ctx.lineTo( p.x / width * this.canvas.width, p.y / height * this.canvas.height );


			}

			this.ctx.fillStyle = "#fff";
			this.ctx.strokeStyle = "#fff";
			this.ctx.lineWidth = 2.0;
			this.ctx.closePath();
			this.ctx.fill();
			this.ctx.stroke();

			this.maskTexture.needsUpdate = true;

		}


	}

}
