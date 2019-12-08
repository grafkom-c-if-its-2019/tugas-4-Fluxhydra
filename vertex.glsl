precision mediump float;

attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexCoord;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;

uniform mat3 normalMatrix;

void main()
{
  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);

  // Send vertex points, normal vectors and texture coordinates to fragment shader
  fPosition = vec3(modelMatrix * vec4(vPosition, 1.0));
  fNormal = normalize(normalMatrix * vNormal);
  fTexCoord = vTexCoord;
}
