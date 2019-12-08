(function() {

  glUtils.SL.init({ callback: function() { main(); } });

  function main()
  {
    // Initialize canvas, shaders and program
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Store vertices into buffers
    function initBuffers(vertices)
    {
      var n = vertices.length / 2;
      var vertexBuffer = gl.createBuffer();
      if(!vertexBuffer)
      {
        console.log('Failed to create the buffer object');
        return -1;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      var vPosition = gl.getAttribLocation(program, 'vPosition');
      if(vPosition < 0)
      {
        console.log('Failed to get the storage location of vPosition');
        return -1;
      }
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);
      return n;
    }

    // Generic function to draw the character 'A'
    function charDraw(type, vertices)
    {
      var n = initBuffers(vertices)
      if(n < 0)
      {
        console.log('Failed to set the positions of the vertices');
        return;
      }
      gl.drawArrays(type, 0, n);
    }

    // Store cube vertices
    var cubeVertices = [];

    // Store cube corner points
    var cubePoints = 
    [
      [-0.5, -0.5,  0.5],
      [-0.5,  0.5,  0.5],
      [ 0.5,  0.5,  0.5],
      [ 0.5, -0.5,  0.5],
      [-0.5, -0.5, -0.5],
      [-0.5,  0.5, -0.5],
      [ 0.5,  0.5, -0.5],
      [ 0.5, -0.5, -0.5]
    ];
    
    // Store cube normal vectors
    var cubeNormals = 
    [
      [],
      [ 0.0,  0.0,  1.0], // Front
      [ 1.0,  0.0,  0.0], // Right
      [ 0.0, -1.0,  0.0], // Bottom
      [ 0.0,  0.0, -1.0], // Back
      [-1.0,  0.0,  0.0], // Left
      [ 0.0,  1.0,  0.0], // Up
      []
    ];
    
    // Store cube texture coordinates
    var cubeTexCoords =
    [
      [0.0,  0.0],   // LD1
      [0.0,  0.5],   // LU1
      [0.25, 0.5],   // RU1
      [0.25, 0.0],   // RD1

      [0.25, 0.0],   // LD2
      [0.25, 0.5],   // LU2
      [0.5,  0.5],   // RU2
      [0.5,  0.0],   // RD2

      [0.5,  0.0],   // LD3
      [0.5,  0.5],   // LU3
      [0.75, 0.5],   // RU3
      [0.75, 0.0],   // RD3

      [0.0,  0.5],   // LU4
      [0.0,  1.0],   // LD4
      [0.25, 1.0],   // RD4
      [0.25, 0.5],   // RU4

      [0.25, 0.5],   // LU5
      [0.25, 1.0],   // LD5
      [0.5,  1.0],   // RD5
      [0.5,  0.5],   // RU5
    ]

    // Push raw cube vertices
    function quad(a, b, c, d, e)
    {
      var indices = [a, b, c, a, c, d];
      for (var i = 0; i < indices.length; i++)
      {
        for (var j = 0; j < 3; j++)
        {
          cubeVertices.push(cubePoints[indices[i]][j]);
        }
        for (var j = 0; j < 3; j++)
        {
          cubeVertices.push(cubeNormals[a][j]);
        }
        for (var j = 0; j < 2; j++)
        {
          switch (indices[i])
          {
            case a:
              cubeVertices.push(cubeTexCoords[e][j]);
              break;
            case b:
              cubeVertices.push(cubeTexCoords[e+1][j]);
              break;
            case c:
              cubeVertices.push(cubeTexCoords[e+2][j]);
              break;
            case d:
              cubeVertices.push(cubeTexCoords[e+3][j]);
              break;
              
            default:
              break;
          }
        }
      }
    }

    // Get those cube vertices ready
    quad(2, 3, 7, 6, 0);  // Right
    quad(3, 0, 4, 7, 4);  // Down
    quad(4, 5, 6, 7, 8); // Back
    quad(5, 4, 0, 1, 12);  // Left
    quad(6, 5, 1, 2, 16);  // Up

    // Abdurrahman (16-087) -> Character 'A'
    // Special triangle (5, 12, 13)
    // Line Equation BH -> y = (8/33)x + 3
    // Gradient m = 8/33

    // Locations
    // 0.0, 0.7, //A
    // 0.0, 0.3, //B
    // -0.12375, 0.0, //C
    // 0.12375, 0.0, //D
    // -0.193875, -0.17, //E
    // 0.193875, -0.17, //F
    // -0.5, -0.5, //G
    // -0.333, -0.5, //H
    //  0.333, -0.5, //I
    //  0.5, -0.5, //J

    // Triangle points for ABGH
    var myABGH = new Float32Array
    (
      [0.0, 0.7, 0.0, 0.3, -0.5, -0.5, -0.333, -0.5]
    );

    // Triangle points for ABJI
    var myABJI = new Float32Array
    (
      [0.0, 0.7, 0.0, 0.3, 0.5, -0.5, 0.333, -0.5]
    );

    // Triangle points for CEFD
    var myCEFD = new Float32Array
    (
      [-0.12375, 0.0, -0.193875, -0.17, 0.193875, -0.17, 0.12375, 0.0]
    );

    // Character 'A' scale, translation and rotation
    var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
    var scaleA = [0.3, 0.3, 0.3];
    var trans =
    {
      x: 0.0, y: 0.0, z: 0.0
    }
    var xAdd = 0.02, yAdd = 0.02, zAdd = 0.02;
    var thetaA = 0.0;

    // Model transformation
    var theta = [0.0, 0.0, 0.0];
    var xAxis = 0.0, yAxis = 0.0, zAxis = 0.0;
    var thetaSpeed = 0.0;

    // Keyboard interaction: Character '-', '=' and '0'
    function onKeyDown(event) 
    {
      if (event.keyCode == 189) thetaSpeed -= 0.005;     
      else if (event.keyCode == 187) thetaSpeed += 0.005; 
      else if (event.keyCode == 48) thetaSpeed = 0;     
    }
    document.addEventListener('keydown', onKeyDown);

    // Mouse interactions
    var lastx, lasty, dragging;

    // Press the left click
    function onMouseDown(event)
    {
      var x = event.clientX;
      var y = event.clientY;
      var rect = event.target.getBoundingClientRect();
      if 
      (
        rect.left <= x &&
        rect.right > x &&
        rect.top <= y &&
        rect.bottom > y
      ) 
      {
        lastx = x;
        lasty = y;
        dragging = true;
      }
    }

    // Release
    function onMouseUp(event)
    {
      dragging = false;
    }

    // Move
    function onMouseMove(event)
    {
      var x = event.clientX;
      var y = event.clientY;
      if (dragging) 
      {
        var factor = 5 / canvas.height;
        var dx = factor * (x - lastx);  // Horizonal
        var dy = factor * (y - lasty);  // Vertical
        theta[xAxis] += dy;
        theta[yAxis] += dx;
      }
      lastx = x;
      lasty = y;
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    // Set the view matrix
    var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
    var vm = glMatrix.mat4.create();
    glMatrix.mat4.lookAt
    (
      vm,
      glMatrix.mat3.fromValues(0.0, 0.0,  0.0), // Attribute: Camera "eye"
      glMatrix.mat3.fromValues(0.0, 0.0, -2.0), // Attribute: Camera "at"
      glMatrix.mat3.fromValues(0.0, 1.0,  0.0)  // Attribute: Camera "up"
    );
    gl.uniformMatrix4fv(vmLoc, false, vm);

    // Set the perspective matrix
    var pmLoc = gl.getUniformLocation(program, 'perspectiveMatrix');
    var pm = glMatrix.mat4.create();
    glMatrix.mat4.perspective
    (
      pm,
      glMatrix.glMatrix.toRadian(90), // Attribute: Camera "FoV" in radian
      canvas.width / canvas.height,
      1.0,  // Attribute: Camera "near"
      10.0  // Attribute: Camera "far"
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    // Set the lighting: color, position, ambient
    var lightColorLoc = gl.getUniformLocation(program, 'lightColor');
    var lightColor = [1.0, 1.0, 1.0];
    gl.uniform3fv(lightColorLoc, lightColor);

    var lightPositionLoc = gl.getUniformLocation(program, 'lightPosition');
    var lightPosition = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
    gl.uniform3fv(lightPositionLoc, lightPosition);

    var ambientColorLoc = gl.getUniformLocation(program, 'ambientColor');
    var ambientColor = glMatrix.vec3.fromValues(0.16, 0.40, 0.87);
    gl.uniform3fv(ambientColorLoc, ambientColor);

    var nmLoc = gl.getUniformLocation(program, 'normalMatrix');
    
    function render()
    {
      // Buffers cleared!
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Model transformation
      theta[xAxis] += thetaSpeed;
      theta[yAxis] += thetaSpeed;
      theta[zAxis] += thetaSpeed;
      var mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
      glMatrix.mat4.rotateZ(mm, mm, theta[zAxis]);
      glMatrix.mat4.rotateY(mm, mm, theta[yAxis]);
      glMatrix.mat4.rotateX(mm, mm, theta[xAxis]);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      // Normal vectors
      var nm = glMatrix.mat3.normalFromMat4(glMatrix.mat3.create(), mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);

      // Cube buffers
      var cubeVBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

      // Attribute locations and pointers
      var vPosition = gl.getAttribLocation(program, 'vPosition');
      var vNormal = gl.getAttribLocation(program, 'vNormal');
      var vTexCoord = gl.getAttribLocation(program, 'vTexCoord');

      gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vNormal);
      gl.enableVertexAttribArray(vTexCoord);

      // Draw cube
      gl.drawArrays(gl.TRIANGLES, 0, 30);

      // Reduce the 'A' size
      glMatrix.mat4.scale(mm, mm, scaleA);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      // Rotate the 'A' character
      thetaA += 0.0087;
      glMatrix.mat4.rotateY(mm, mm, thetaA);

      // Random translation for 'A' character
      if(trans.x + 0.5 > 0.5*3.5 || trans.x + -0.5 < -0.5*3.5)
      {
        xAdd *= -1;
      }
      trans.x += xAdd;
      if(trans.y + 0.5 > 0.5*3.5 || trans.y + -0.5 < -0.5*3.5)
      {
        yAdd *= -1;
      }
      trans.y += yAdd;
      if(trans.z + 0.5 > 0.5*3.5 || trans.z + -0.5 < -0.5*3.5)
      {
        zAdd *= -1;
      }
      trans.z += zAdd;
      glMatrix.mat4.translate(mm, mm, [trans.x, trans.y, trans.z]);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      // Draw the 'A' character
      charDraw(gl.TRIANGLE_FAN, myABGH);
      charDraw(gl.TRIANGLE_FAN, myABJI);
      charDraw(gl.TRIANGLE_FAN, myCEFD);

      requestAnimationFrame(render);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Create a texture
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255]));

    gl.activeTexture(gl.TEXTURE0);
    var sampler0Loc = gl.getUniformLocation(program, 'sampler0');
    gl.uniform1i(sampler0Loc, 0);

    // Asynchronously load an image
    var image = new Image();
    image.src = "images/Ihatecameras.png";
    image.addEventListener('load', function() 
    {
      // Now that the image has been loaded, make some copies of it to the texture
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

    render();
  }
})();