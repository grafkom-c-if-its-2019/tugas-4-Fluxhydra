(function() {

  glUtils.SL.init({ callback: function() { main(); } });

  function main() {
    
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);

    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    var vertices = [
      //Abdurrahman (16-087) -> Huruf A
      //Segitiga acuan 5, 12, 13
      //Persamaan garis BH -> y = (8/33)x + 3
      //Gradien m = 8/33

      //Titik
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

      //Garis
      // 0.0, 0.7, -0.5, -0.5, //AG
      // -0.5, -0.5, -0.333, -0.5, //GH
      // -0.333, -0.5, -0.193875, -0.17, //HE
      // -0.193875, -0.17, 0.193875, -0.17, //EF
      // 0.193875, -0.17, 0.333, -0.5, //FI
      // 0.333, -0.5, 0.5, -0.5, //IJ
      // 0.5, -0.5, 0.0, 0.7, //JA
      // 0.0, 0.3, -0.12375, 0.0, //BC
      // -0.12375, 0.0, 0.12375, 0.0, //CD
      // 0.12375, 0.0, 0.0, 0.3 //DB

      //Segitiga
      0.0, 0.7, 0.0, 0.3, -0.5, -0.5, //ABG
      0.0, 0.3, -0.5, -0.5, -0.333, -0.5, //BGH
      0.0, 0.7, 0.0, 0.3, 0.5, -0.5, //ABJ
      0.0, 0.3, 0.333, -0.5, 0.5, -0.5, //BIJ
      -0.12375, 0.0, -0.193875, -0.17, 0.193875, -0.17, //CEF
      -0.12375, 0.0, 0.12375, 0.0, 0.193875, -0.17 //CDF

      // //Segitiga A
      // 0.5, 0.7, 0.5, 0.3, 0.0, -0.5, //ABG
      // 0.5, 0.3, 0.0, -0.5, 0.167, -0.5, //BGH
      // 0.5, 0.7, 0.5, 0.3, 1.0, -0.5, //ABJ
      // 0.5, 0.3, 0.833, -0.5, 1.0, -0.5, //BIJ
      // 0.37625, 0.0, 0.306125, -0.17, 0.693875, -0.17, //CEF
      // 0.37625, 0.0, 0.62375, 0.0, 0.693875, -0.17 //CDF
    ];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var oColor = gl.getUniformLocation(program, 'oColor');
    var opacity = 1.0;
    var colorFlag = 1;

    // keyboard input
    function onKeyDown(event)
    {
      switch(event.keyCode)
      {
        // Change camera: eye
        case 81: //q
          eyeX += 0.5;
          break;
        case 87: //w
          eyeX -= 0.5;
          break;
        case 69: //e
          eyeY += 0.5;
          break;
        case 82: //r
          eyeY -= 0.5;
          break;
        case 84: //t
          eyeZ += 0.5;
          break;
        case 89: //y
          eyeZ -= 0.5;
          break;
      }
    }
    document.addEventListener('keydown', onKeyDown);

    // model matrix
    var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
    var theta = 0.0;

    // Definisi matriks pandangan (view matrix)
    var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
    var vm = glMatrix.mat4.create();
    var eyeX = 0.0, eyeY = 0.0, eyeZ = 10.0, atX = 0.0, atY = 0.0, atZ = 0.0, upX = 0.0, upY = 1.0, upZ = 1.0;

    // Definisi matriks proyeksi perspektif 
    var pmLoc = gl.getUniformLocation(program, 'perspectiveMatrix');
    var pm = glMatrix.mat4.create();
    glMatrix.mat4.perspective(pm,
      glMatrix.glMatrix.toRadian(100), // fovy dalam radian
      canvas.width / canvas.height,
      0.1,  // near
      25.0  // far
    );
    gl.uniformMatrix4fv(pmLoc, false, pm);

    var current = [0.0, 0.0, 0.0];
    var myFlag = [0, 0, 0];
    var min = -30, max = 30;
    for(var a = 0; a < 3; a++)
    {
      current[a] = (Math.random() * (+max - +min) + +min)/10;
    }

    function render()
    {
      var mm = glMatrix.mat4.create();
      theta += 0.1087;
      glMatrix.mat4.translate(mm, mm, current);

      // Logika mantul dengan cube 10 x 10 dan range -5 sd 5
      if(current[0]>5)
      {
        myFlag[0] = 1;
      }
      else if(current[0]<-5)
      {
        myFlag[0] = 0;
      }

      if(current[1]>5)
      {
        myFlag[1] = 1;
      }
      else if(current[1]<-5)
      {
        myFlag[1] = 0;
      }

      if(current[2]>5)
      {
        myFlag[2] = 1;
      }
      else if(current[2]<-5)
      {
        myFlag[2] = 0;
      }

      // Translasi bebas
      if(myFlag[0]==0)
      {
        current[0] += 0.1;
      }
      else if(myFlag[0]==1)
      {
        current[0] -= 0.1;
      }

      if(myFlag[1]==0)
      {
        current[1] += 0.1;
      }
      else if(myFlag[1]==1)
      {
        current[1] -= 0.1;
      }

      if(myFlag[2]==0)
      {
        current[2] += 0.1;
      }
      else if(myFlag[2]==1)
      {
        current[2] -= 0.1;
      }

      glMatrix.mat4.rotateY(mm, mm, theta);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      // View matrix
      glMatrix.mat4.lookAt(vm,
        glMatrix.mat3.fromValues(eyeX, eyeY, eyeZ), // eye: posisi kamera
        glMatrix.mat3.fromValues(atX, atY, atZ), // at: posisi kamera menghadap
        glMatrix.mat3.fromValues(upX, upY, upZ)  // up: posisi arah atas kamera
      );
      gl.uniformMatrix4fv(vmLoc, false, vm);

      // Bersihkan layar jadi hitam
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
      // Bersihkan buffernya canvas
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Warna gradient
      if(opacity == 1) colorFlag = 1;
      else if (opacity < 0.75) colorFlag = 0;

      if(colorFlag == 1) opacity -= 0.005;
      else opacity += 0.005;
      gl.uniform1f(oColor, opacity);

      //Gambar A
      gl.drawArrays(gl.TRIANGLES, 0, 18);
      requestAnimationFrame(render);
    };
    render();
  }
})();