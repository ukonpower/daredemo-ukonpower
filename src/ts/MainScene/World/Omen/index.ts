import * as THREE from 'three';
import * as ORE from 'ore-three';

import omenVert from './shaders/omen.vs';
import omenFrag from './shaders/omen.fs';

export class Omen extends THREE.Mesh {

	private commonUniforms: ORE.Uniforms;

	constructor( parentUniforms: ORE.Uniforms ) {

		let commonUniforms = ORE.UniformsLib.mergeUniforms( parentUniforms, {
			uTex: {
				value: null
			}
		} );

		let geo = new THREE.PlaneGeometry( 1.0, 1.0 );
		let mat = new THREE.ShaderMaterial( {
			vertexShader: omenVert,
			fragmentShader: omenFrag,
			uniforms: commonUniforms,
			transparent: true,
		} );

		super( geo, mat );

		this.commonUniforms = commonUniforms;

		new THREE.TextureLoader().load( BASE_PATH + '/tex/ukonpower.jpg', ( tex ) => {

			this.commonUniforms.uTex.value = tex;

		} );

	}

}
