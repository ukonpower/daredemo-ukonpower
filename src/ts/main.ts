import * as ORE from 'ore-three';
import { MainScene } from './MainScene';

class APP {

	private canvas: HTMLCanvasElement | null;
	private scene: MainScene;
	private controller: ORE.Controller;

	constructor() {

		/*------------------------
			checkUA
		------------------------*/

		var ua = navigator.userAgent;
		window.isSP = ( ua.indexOf( 'iPhone' ) > 0 || ua.indexOf( 'iPod' ) > 0 || ua.indexOf( 'Android' ) > 0 && ua.indexOf( 'Mobile' ) > 0 || ua.indexOf( 'iPad' ) > 0 || ua.indexOf( 'Android' ) > 0 || ua.indexOf( 'macintosh' ) > 0 );
		window.isSP = window.isSP || navigator.platform == "iPad" || ( navigator.platform == "MacIntel" && navigator.userAgent.indexOf( "Safari" ) != - 1 && navigator.userAgent.indexOf( "Chrome" ) == - 1 && ( navigator as any ).standalone !== undefined );

		/*------------------------
			init ORE
		------------------------*/

		this.canvas = document.querySelector( "#canvas" );

		this.scene = new MainScene( {
			name: 'Main',
			canvas: this.canvas || undefined
	   } );

		this.controller = new ORE.Controller();
		this.controller.addLayer( this.scene );

	}

}

window.addEventListener( 'load', ()=>{

	new APP();

} );
