import { MainScene } from "./MainScene";
import { GlobalManager } from "./MainScene/GlobalManager";
import { AssetManager } from "./MainScene/GlobalManager/AssetManager";

declare global {
	const faceapi: any;
	const BASE_PATH: string;
	interface Window {
		gManager: GlobalManager;
		assetManager: AssetManager;
		isIE: boolean;
		isSP: boolean;
		mainScene: MainScene;
	}
}
