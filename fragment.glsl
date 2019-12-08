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
  float diffuseIntensity = max(dot(lightDirection, normal), 0.0);

  // Reflect the vector accross normal space
  vec3 from_light_dir = normalize(fPosition - lightPosition);  
  vec3 reflection_dir = reflect(from_light_dir, normal);
  vec3 camera_dir = normalize(vec3(1.0, 1.0, 1.0));
  float specIntensity = dot(reflection_dir, camera_dir);

  // Get texture colors 
  vec4 tex0 = texture2D(sampler0, fTexCoord);

  // Get diffuse value
  vec3 diffuse = lightColor * tex0.rgb * diffuseIntensity;

  // Get ambient value
  vec3 ambient = ambientColor * tex0.rgb;

  // Get specular value
  vec3 specular = lightColor * tex0.rgb * specIntensity;

  gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
}
