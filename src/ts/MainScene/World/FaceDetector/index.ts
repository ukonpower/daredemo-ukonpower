import EventEmitter from "wolfy87-eventemitter";

export class FaceDetector extends EventEmitter {

	public videoElm: HTMLVideoElement;
	public stream: MediaStream | null;

	public detectOptions: any;
	public detectInterval: number | null;

	constructor() {

		super();

		this.videoElm = document.createElement( "video" ) as HTMLVideoElement;
		this.videoElm.autoplay = true;

		this.stream = null;
		this.detectInterval = null;

		this.init();

	}

	private async init() {

		await Promise.all( [
			faceapi.loadSsdMobilenetv1Model( BASE_PATH + "/weights" ),
			faceapi.loadFaceLandmarkModel( BASE_PATH + "/weights" ),
			faceapi.loadFaceRecognitionModel( BASE_PATH + "/weights" ),
			faceapi.nets.tinyFaceDetector.load( BASE_PATH + '/weights' )
		] );

		this.videoElm.onplay = () => {

			const inputSize = 512;
			const scoreThreshold = 0.5;
			this.detectOptions = new faceapi.TinyFaceDetectorOptions( {
				inputSize,
				scoreThreshold
			} );

		};

		this.stream = await navigator.mediaDevices.getUserMedia( {
			audio: false,
			video: {
				width: 512,
				height: 512
			}
		} );

		this.videoElm.srcObject = this.stream;

	}

	private cnt = 0;

	public async update() {

		this.cnt ++;

		if ( this.cnt % 50 == 0 || true ) {

			const result = await faceapi.detectSingleFace(
				this.videoElm,
				this.detectOptions
			).withFaceLandmarks();

			this.emitEvent( "update", [ result ] );

		}

	}

	public dispose() {

		if ( this.detectInterval !== null ) {

			window.clearInterval( this.detectInterval );

			this.detectInterval = null;

		}

		this.videoElm.remove();

	}

}
