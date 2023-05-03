uniform sampler2D uTex;
uniform sampler2D uMaskTex;
varying vec2 vUv;

void main( void ) {

	vec4 col = texture2D( uTex, vUv );
	vec4 mask = texture2D( uMaskTex, vUv );

	col.w *= mask.x;
	
	gl_FragColor = col;

}