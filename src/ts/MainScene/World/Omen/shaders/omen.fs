uniform sampler2D uTex;
varying vec2 vUv;

void main( void ) {

	vec4 col = texture2D( uTex, vUv );
	gl_FragColor = col;

}