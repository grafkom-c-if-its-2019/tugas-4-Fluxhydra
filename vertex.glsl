precision mediump float;

attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;

void main()
{
  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
}
