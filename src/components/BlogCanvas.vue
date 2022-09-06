<template>
    <div id="canvas_container">
        <canvas ref="canvas" id="main_canvas"></canvas>
    </div>
</template>

<script>
    import * as webglUtils from 'webgl-utils.js';

    export default{
        name: "BlogCanvas",
        data(){
            return {
                vertexShaderSource : 
                `#version 300 es
 
                // an attribute is an input (in) to a vertex shader.
                // It will receive data from a buffer
                in vec4 a_position;
                
                // all shaders have a main function
                void main() {
                
                // gl_Position is a special variable a vertex shader
                // is responsible for setting
                gl_Position = a_position;
                }`,
                fragmentShaderSource:
                `#version 300 es
 
                // fragment shaders don't have a default precision so we need
                // to pick one. highp is a good default. It means "high precision"
                precision highp float;
                
                // we need to declare an output for the fragment shader
                out vec4 outColor;
                
                void main() {
                // Just set the output to a constant reddish-purple
                outColor = vec4(1, 0, 0.5, 1);
                }
                `
            }
        },
        mounted(){
            this.initialize();
        },
        methods: {
            initialize() {
                console.log("initialized");

                var canvas =  this.$refs.canvas;
                var gl = canvas.getContext("webgl2");
                if(!gl){
                    console.log("webgl not supported");
                }

                var vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
                var fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
                var program = this.createProgram(gl, vertexShader, fragmentShader);

                var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
                var positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                var positions = [
                0, 0,
                0, 0.5,
                0.7, 0,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

                var vao = gl.createVertexArray();
                gl.bindVertexArray(vao);
                gl.enableVertexAttribArray(positionAttributeLocation);

                var size = 2;          // 2 components per iteration
                var type = gl.FLOAT;   // the data is 32bit floats
                var normalize = false; // don't normalize the data
                var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
                var offset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
                
                webglUtils.resizeCanvasToDisplaySize(gl.canvas);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                // Tell it to use our program (pair of shaders)
                gl.useProgram(program);
                // Bind the attribute/buffer set we want.
                gl.bindVertexArray(vao);

                var primitiveType = gl.TRIANGLES;
                var off = 0;
                var count = 3;
                gl.drawArrays(primitiveType, off, count);
            },
            createShader(gl, type, source){
                var shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
                if (success) {
                    return shader;
                }
                
                console.log(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
            },
            createProgram(gl, vertexShader, fragmentShader){
                var program = gl.createProgram();
                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);
                var success = gl.getProgramParameter(program, gl.LINK_STATUS);
                if (success) {
                    return program;
                }
                
                console.log(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
            }
        }
    }
</script>

<style scoped>
canvas{
    width:100%;
    height: 100%;
}

#canvas_container{
    height: calc(100% - 60px);
    width: 100%;
    position: absolute;
    overflow: hidden;
}
</style>