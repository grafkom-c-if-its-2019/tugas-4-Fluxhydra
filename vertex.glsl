precision mediump float;

attribute vec4 vPosition;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;
uniform mat4 modelMatrix;

void main()
{
  //Rotasi Y terhadap huruf A
  gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * vPosition;
}
