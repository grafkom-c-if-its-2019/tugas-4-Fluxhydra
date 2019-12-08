precision mediump float;

uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform vec3 ambientColor;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;

uniform sampler2D sampler0;

void main() 
{
  // Normalized
  vec3 normal = normalize(fNormal);

  // Incoming light and normal vector (degree), get the cos value
  vec3 lightDirection = normalize(lightPosition - fPosition);
  float lightIntensity = max(dot(lightDirection, normal), 0.0);

  // Get texture colors 
  vec4 tex0 = texture2D(sampler0, fTexCoord);

  // Get diffusion from light and material interactions
  vec3 diffuse = lightColor * tex0.rgb * lightIntensity;

  // Get ambient value
  vec3 ambient = ambientColor * tex0.rgb;
  
  gl_FragColor = vec4(diffuse + ambient, 1.0);
}
