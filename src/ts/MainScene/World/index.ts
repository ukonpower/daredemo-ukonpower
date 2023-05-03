import * as THREE from 'three';
import * as ORE from 'ore-three';
import { FaceDetector } from './FaceDetector';
import { Face } from './Face';
import { Omen } from './Omen';

export class World extends THREE.Object3D {

	private scene: THREE.Scene;
	private commonUniforms: ORE.Uniforms;

	private detector: FaceDetector;
	private face: Face;
	private omen: Omen;

	private faceSize: THREE.Vector2;
	private faceCenter: THREE.Vector2;

	private sizeSmooth: THREE.Vector2 | null
	private centerSmooth: THREE.Vector2 | null;

	constructor( scene: THREE.Scene, parentUniforms: ORE.Uniforms ) {

		super();

		this.scene = scene;
		this.scene.background = new THREE.Color( '#0F0' );

		this.commonUniforms = ORE.UniformsLib.mergeUniforms( parentUniforms, {
		} );

		this.sizeSmooth = null;
		this.centerSmooth = null;
		this.faceSize = new THREE.Vector2();
		this.faceCenter = new THREE.Vector2();

		this.detector = new FaceDetector();

		this.face = new Face( this.detector.videoElm, this.commonUniforms );
		this.add( this.face );

		this.omen = new Omen( this.commonUniforms );
		this.omen.position.set( 0, 0, - 0.01 );
		this.add( this.omen );

		const onUpdateFace = this.onUpdateFace.bind( this );

		this.detector.addListener( 'update', onUpdateFace );

		const onDispose = () => {

			this.detector.removeListener( "update", onUpdateFace );

			this.removeEventListener( "dispose", onDispose );

		};

		this.addEventListener( 'dispose', onDispose );

	}

	private onUpdateFace( face: any ) {

		if ( ! face ) return;

		// omen

		let relativeBox = face.detection.relativeBox;

		this.faceSize.set( relativeBox.width, relativeBox.width );

		this.faceCenter = new THREE.Vector2( relativeBox.x + this.faceSize.x / 2.0, 1.0 - relativeBox.y - this.faceSize.y / 2.0 + this.faceSize.x / 10.0 );
		this.faceCenter.subScalar( 0.5 );

		// face

		this.face.updateMask( face.landmarks );

	}

	public update( deltaTime: number, camera: THREE.OrthographicCamera ) {

		this.detector.update();

		let speed = deltaTime * 5.0;

		if ( ! this.sizeSmooth ) {

			this.sizeSmooth = this.faceSize.clone();

		} else {

			this.sizeSmooth.lerp( this.faceSize, speed );

		}



		if ( ! this.centerSmooth ) {

			this.centerSmooth = this.faceCenter.clone();

		} else {

			this.centerSmooth.lerp( this.faceCenter, speed );

		}

		let scale = 2.0;

		this.omen.position.set( this.centerSmooth.x, this.centerSmooth.y, this.omen.position.z );
		this.omen.scale.set( this.sizeSmooth.x * scale, this.sizeSmooth.y * scale, 1.0 );

	}

	public resize( info: ORE.LayerInfo ) {
	}

	public dispose() {

		this.detector.dispose();

		this.dispatchEvent( { type: "dispose" } );

	}

}
