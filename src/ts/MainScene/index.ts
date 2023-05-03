import * as THREE from 'three';
import { GlobalManager } from './GlobalManager';
import { World } from './World';
import * as ORE from 'ore-three';
export class MainScene extends ORE.BaseLayer {

	private gManager: GlobalManager;

	private oCamera: THREE.OrthographicCamera;
	private world?: World;

	constructor( param: ORE.LayerParam ) {

		super( param );

		this.commonUniforms = ORE.UniformsLib.mergeUniforms( this.commonUniforms, {} );

		this.oCamera = new THREE.OrthographicCamera();

		this.camera.position.set( 0.0, 0.0, 1 );
		this.camera.lookAt( 0, 0, 0 );

		/*-------------------------------
			Gmanager
		-------------------------------*/

		this.gManager = new GlobalManager();

		this.gManager.assetManager.load( {
			assets: [
			]
		} );

		this.gManager.assetManager.addEventListener( 'loadMustAssets', ( e ) => {

			this.initScene();
			this.onResize();

		} );

	}

	onUnbind() {

		super.onUnbind();

		if ( this.world ) {

			this.world.dispose();

		}

	}

	private initScene() {

		/*-------------------------------
			World
		-------------------------------*/

		this.world = new World( this.scene, this.commonUniforms );
		this.scene.add( this.world );

	}

	public animate( deltaTime: number ) {

		if ( this.gManager ) {

			this.gManager.update( deltaTime );

		}

		if ( this.world ) {

			this.world.update( deltaTime, this.oCamera );

		}

		this.renderer.render( this.scene, this.camera );

	}

	public onResize() {

		super.onResize();

		if ( this.world ) {

			this.world.resize( this.info );

		}

	}

	public onHover( args: ORE.TouchEventArgs ) {

	}

	public onTouchStart( args: ORE.TouchEventArgs ) {
	}

	public onTouchMove( args: ORE.TouchEventArgs ) {
	}

	public onTouchEnd( args: ORE.TouchEventArgs ) {
	}

	public onWheelOptimized( event: WheelEvent ) {
	}

}
