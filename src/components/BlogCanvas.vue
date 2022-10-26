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
                precision highp float;
 
                uniform vec2 iResolution;
                uniform vec2 iMouse;
                uniform float iTime;
                uniform vec4 iDate;

                <!-- insert here -->
                
                out vec4 outColor;
                void main() {
                    mainImage(outColor, gl_FragCoord.xy);
                }
                `,
                SaturdayTorus:`
                // License CC0: Saturday Torus
                //  Inspired by: https://www.istockphoto.com/photo/black-and-white-stripes-projection-on-torus-gm488221403-39181884

                #define PI          3.141592654
                #define TAU         (2.0*PI)
                #define TIME        iTime
                #define TTIME       (TAU*TIME)
                #define RESOLUTION  iResolution
                #define ROT(a)      mat2(cos(a), sin(a), -sin(a), cos(a))
                #define PCOS(x)     (0.5+0.5*cos(x))

                // License: MIT, author: Inigo Quilez, found: https://iquilezles.org/articles/intersectors
                float rayTorus(vec3 ro, vec3 rd, vec2 tor) {
                  float po = 1.0;

                  float Ra2 = tor.x*tor.x;
                  float ra2 = tor.y*tor.y;

                  float m = dot(ro,ro);
                  float n = dot(ro,rd);

                  // bounding sphere
                  {
                    float h = n*n - m + (tor.x+tor.y)*(tor.x+tor.y);
                    if(h<0.0) return -1.0;
                    //float t = -n-sqrt(h); // could use this to compute intersections from ro+t*rd
                  }

                  // find quartic equation
                  float k = (m - ra2 - Ra2)/2.0;
                  float k3 = n;
                  float k2 = n*n + Ra2*rd.z*rd.z + k;
                  float k1 = k*n + Ra2*ro.z*rd.z;
                  float k0 = k*k + Ra2*ro.z*ro.z - Ra2*ra2;

                  #ifndef TORUS_REDUCE_PRECISION
                  // prevent |c1| from being too close to zero
                  if(abs(k3*(k3*k3 - k2) + k1) < 0.01)
                  {
                    po = -1.0;
                    float tmp=k1; k1=k3; k3=tmp;
                    k0 = 1.0/k0;
                    k1 = k1*k0;
                    k2 = k2*k0;
                    k3 = k3*k0;
                  }
                  #endif

                  float c2 = 2.0*k2 - 3.0*k3*k3;
                  float c1 = k3*(k3*k3 - k2) + k1;
                  float c0 = k3*(k3*(-3.0*k3*k3 + 4.0*k2) - 8.0*k1) + 4.0*k0;


                  c2 /= 3.0;
                  c1 *= 2.0;
                  c0 /= 3.0;

                  float Q = c2*c2 + c0;
                  float R = 3.0*c0*c2 - c2*c2*c2 - c1*c1;

                  float h = R*R - Q*Q*Q;
                  float z = 0.0;
                  if(h < 0.0) {
                    // 4 intersections
                    float sQ = sqrt(Q);
                    z = 2.0*sQ*cos(acos(R/(sQ*Q)) / 3.0);
                  } else {
                    // 2 intersections
                    float sQ = pow(sqrt(h) + abs(R), 1.0/3.0);
                    z = sign(R)*abs(sQ + Q/sQ);
                  }
                  z = c2 - z;

                  float d1 = z   - 3.0*c2;
                  float d2 = z*z - 3.0*c0;
                  if(abs(d1) < 1.0e-4) {
                    if(d2 < 0.0) return -1.0;
                    d2 = sqrt(d2);
                  } else {
                    if(d1 < 0.0) return -1.0;
                    d1 = sqrt(d1/2.0);
                    d2 = c1/d1;
                  }

                  //----------------------------------

                  float result = 1e20;

                  h = d1*d1 - z + d2;
                  if(h > 0.0) {
                    h = sqrt(h);
                    float t1 = -d1 - h - k3; t1 = (po<0.0)?2.0/t1:t1;
                    float t2 = -d1 + h - k3; t2 = (po<0.0)?2.0/t2:t2;
                    if(t1 > 0.0) result=t1;
                    if(t2 > 0.0) result=min(result,t2);
                  }

                  h = d1*d1 - z - d2;
                  if(h > 0.0) {
                    h = sqrt(h);
                    float t1 = d1 - h - k3;  t1 = (po<0.0)?2.0/t1:t1;
                    float t2 = d1 + h - k3;  t2 = (po<0.0)?2.0/t2:t2;
                    if(t1 > 0.0) result=min(result,t1);
                    if(t2 > 0.0) result=min(result,t2);
                  }

                  return result;
                }

                // License: MIT, author: Inigo Quilez, found: https://iquilezles.org/articles/intersectors
                vec3 torusNormal(vec3 pos, vec2 tor) {
                  return normalize(pos*(dot(pos,pos)- tor.y*tor.y - tor.x*tor.x*vec3(1.0,1.0,-1.0)));
                }

                // License: Unknown, author: Unknown, found: don't remember
                float tanh_approx(float x) {
                  //  Found this somewhere on the interwebs
                  //  return tanh(x);
                  float x2 = x*x;
                  return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
                }

                vec3 color(vec2 p, vec2 q) {
                  const float rdd = 2.0;
                  vec3 ro  = 1.*vec3(0., 0.75, -0.2);
                  vec3 la  = vec3(0.0, 0.0, 0.2);
                  vec3 up  = vec3(0.3, 0.0, 1.0);
                  vec3 lp1 = ro;
                  lp1.xy  *= ROT(0.85);
                  lp1.xz  *= ROT(-0.5);

                  vec3 ww = normalize(la - ro);
                  vec3 uu = normalize(cross(up, ww));
                  vec3 vv = normalize(cross(ww,uu));
                  vec3 rd = normalize(p.x*uu + p.y*vv + rdd*ww);

                  const vec2 tor = 0.55*vec2(1.0, 0.75);
                  float td    = rayTorus(ro, rd, tor);
                  vec3  tpos  = ro + rd*td;
                  vec3  tnor  = -torusNormal(tpos, tor);
                  vec3  tref  = reflect(rd, tnor);

                  vec3  ldif1 = lp1 - tpos;
                  float ldd1  = dot(ldif1, ldif1);
                  float ldl1  = sqrt(ldd1);
                  vec3  ld1   = ldif1/ldl1;
                  vec3  sro   = tpos+0.05*tnor;
                  float sd    = rayTorus(sro, ld1, tor);
                  vec3  spos  = sro+ld1*sd;
                  vec3  snor  = -torusNormal(spos, tor);

                  float dif1  = max(dot(tnor, ld1), 0.0);
                  float spe1  = pow(max(dot(tref, ld1), 0.0), 10.0);
                  float r     = length(tpos.xy);
                  float a     = atan(tpos.y, tpos.x)-PI*tpos.z/(r+0.5*abs(tpos.z))-TTIME/45.0;
                  float s     = mix(0.05, 0.5, tanh_approx(2.0*abs(td-0.75)));
                  vec3  bcol0 = vec3(0.3);  
                  vec3  bcol1 = vec3(0.025);  
                  vec3  tcol  = mix(bcol0, bcol1, smoothstep(-s, s, sin(9.0*a)));

                  vec3 col = vec3(0.0);

                  if (td > -1.0) {
                    col += tcol*mix(0.2, 1.0, dif1/ldd1)+0.25*spe1;
                    col *= sqrt(abs(dot(rd, tnor)));
                  }
                  
                  if (sd < ldl1) {
                    col *= mix(1.0, 0.0, pow(abs(dot(ld1, snor)), 3.0*tanh_approx(sd)));
                  }

                  return col;
                }

                // License: MIT, author: Inigo Quilez, found: https://iquilezles.org/www/index.htm
                vec3 postProcess(vec3 col, vec2 q) {
                  col = clamp(col, 0.0, 1.0);
                  col = pow(col, 1.0/vec3(2.2));
                  col = col*0.6+0.4*col*col*(3.0-2.0*col);
                  col = mix(col, vec3(dot(col, vec3(0.33))), -0.4);
                  col *=0.5+0.5*pow(19.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.7);
                  return col;
                }

                void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
                  vec2 q = fragCoord/iResolution.xy;
                  vec2 p = -1. + 2. * q;
                  p.x *= RESOLUTION.x/RESOLUTION.y;
                  vec3 col = color(p, q);
                  col = postProcess(col, q);
                  fragColor = vec4(col, 1.0);
                }`,
                NixieTubeClock:`
                #define TWELVE_HOUR_CLOCK   1
                #define GLOWPULSE    1
                #define SHOW_GRID

                float pi = atan(1.0)*4.0;
                float tau = atan(1.0)*8.0;

                const float scale = 1.0 / 6.0;

                vec2 digitSize = vec2(1.0,1.5) * scale;
                vec2 digitSpacing = vec2(1.1,1.6) * scale;



                // hash function copy from https://www.shadertoy.com/view/4djSRW
                float hash12(vec2 p)
                {
                    vec3 p3  = fract(vec3(p.xyx) * .1031);
                    p3 += dot(p3, p3.yzx + 33.33);
                    return fract((p3.x + p3.y) * p3.z);
                }


                float noise(vec2 pos) {
                    vec2 i = floor(pos);
                    vec2 f = fract(pos);
                    
                    float a = hash12(i);
                    float b = hash12(i + vec2(1, 0));
                    float c = hash12(i + vec2(0, 1));
                    float d = hash12(i + vec2(1, 1));

                    vec2 u = f * f * (3.0 - 2.0 * f);

                    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
                }

                //Distance to a line segment,
                float dfLine(vec2 start, vec2 end, vec2 uv)
                {
                  start *= scale;
                  end *= scale;
                    
                  vec2 line = end - start;
                  float frac = dot(uv - start,line) / dot(line,line);
                  return distance(start + line * clamp(frac, 0.0, 1.0), uv);
                }

                //Distance to the edge of a circle.
                float dfCircle(vec2 origin, float radius, vec2 uv)
                {
                  origin *= scale;
                  radius *= scale;
                    
                  return abs(length(uv - origin) - radius);
                }

                //Distance to an arc.
                float dfArc(vec2 origin, float start, float sweep, float radius, vec2 uv)
                {
                  origin *= scale;
                  radius *= scale;
                    
                  uv -= origin;
                  uv *= mat2(cos(start), sin(start),-sin(start), cos(start));
                  
                  float offs = (sweep / 2.0 - pi);
                  float ang = mod(atan(uv.y, uv.x) - offs, tau) + offs;
                  ang = clamp(ang, min(0.0, sweep), max(0.0, sweep));
                  
                  return distance(radius * vec2(cos(ang), sin(ang)), uv);
                }

                //Distance to the digit "d" (0-9).
                float dfDigit(vec2 origin, float d, vec2 uv)
                {
                  uv -= origin;
                  d = floor(d);
                  float dist = 1e6;
                  
                  if(d == 0.0)
                  {
                    dist = min(dist, dfLine(vec2(1.000,1.000), vec2(1.000,0.500), uv));
                    dist = min(dist, dfLine(vec2(0.000,1.000), vec2(0.000,0.500), uv));
                    dist = min(dist, dfArc(vec2(0.500,1.000),0.000, 3.142, 0.500, uv));
                    dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 3.142, 0.500, uv));
                    return dist;
                  }
                  if(d == 1.0)
                  {
                    dist = min(dist, dfLine(vec2(0.500,1.500), vec2(0.500,0.000), uv));
                    return dist;
                  }
                  if(d == 2.0)
                  {
                    dist = min(dist, dfLine(vec2(1.000,0.000), vec2(0.000,0.000), uv));
                    dist = min(dist, dfLine(vec2(0.388,0.561), vec2(0.806,0.719), uv));
                    dist = min(dist, dfArc(vec2(0.500,1.000),0.000, 3.142, 0.500, uv));
                    dist = min(dist, dfArc(vec2(0.700,1.000),5.074, 1.209, 0.300, uv));
                    dist = min(dist, dfArc(vec2(0.600,0.000),1.932, 1.209, 0.600, uv));
                    return dist;
                  }
                  if(d == 3.0)
                  {
                    dist = min(dist, dfLine(vec2(0.000,1.500), vec2(1.000,1.500), uv));
                    dist = min(dist, dfLine(vec2(1.000,1.500), vec2(0.500,1.000), uv));
                    dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 4.712, 0.500, uv));
                    return dist;
                  }
                  if(d == 4.0)
                  {
                    dist = min(dist, dfLine(vec2(0.700,1.500), vec2(0.000,0.500), uv));
                    dist = min(dist, dfLine(vec2(0.000,0.500), vec2(1.000,0.500), uv));
                    dist = min(dist, dfLine(vec2(0.700,1.200), vec2(0.700,0.000), uv));
                    return dist;
                  }
                  if(d == 5.0)
                  {
                    dist = min(dist, dfLine(vec2(1.000,1.500), vec2(0.300,1.500), uv));
                    dist = min(dist, dfLine(vec2(0.300,1.500), vec2(0.200,0.900), uv));
                    dist = min(dist, dfArc(vec2(0.500,0.500),3.142, 5.356, 0.500, uv));
                    return dist;
                  }
                  if(d == 6.0)
                  {
                    dist = min(dist, dfLine(vec2(0.067,0.750), vec2(0.500,1.500), uv));
                    dist = min(dist, dfCircle(vec2(0.500,0.500), 0.500, uv));
                    return dist;
                  }
                  if(d == 7.0)
                  {
                    dist = min(dist, dfLine(vec2(0.000,1.500), vec2(1.000,1.500), uv));
                    dist = min(dist, dfLine(vec2(1.000,1.500), vec2(0.500,0.000), uv));
                    return dist;
                  }
                  if(d == 8.0)
                  {
                    dist = min(dist, dfCircle(vec2(0.500,0.400), 0.400, uv));
                    dist = min(dist, dfCircle(vec2(0.500,1.150), 0.350, uv));
                    return dist;
                  }
                  if(d == 9.0)
                  {
                    dist = min(dist, dfLine(vec2(0.933,0.750), vec2(0.500,0.000), uv));
                    dist = min(dist, dfCircle(vec2(0.500,1.000), 0.500, uv));
                    return dist;
                  }

                  return dist;
                }

                //Distance to a number
                float dfNumber(vec2 origin, float num, vec2 uv)
                {
                  uv -= origin;
                  float dist = 1e6;
                  float offs = 0.0;
                  
                  for(float i = 5.0;i > -3.0;i--)
                  {	
                    float d = mod(num / pow(10.0,i),10.0);
                    
                    vec2 pos = digitSpacing * vec2(offs,0.0);

                    if(i == 0.0)
                    {
                      dist = min(dist, dfCircle(vec2(offs+0.9,0.1)*1.1, 0.04,uv));
                    }
                    
                    if(num > pow(10.0,i) || i == 0.0)
                    {
                      dist = min(dist, dfDigit(pos, d, uv));
                      offs++;
                    }	
                  }
                  return dist;	
                }

                //Distance to a number This handles 2 digit integers, leading 0's will be drawn
                float dfNumberInt(vec2 origin, int inum, vec2 uv)
                {
                    float num = float(inum);
                  uv -= origin;
                  float dist = 1e6;
                  float offs = 0.0;
                  
                  for(float i = 1.0;i >= 0.0;i--)
                  {	
                    float d = mod(num / pow(10.0,i),10.0);
                    
                    vec2 pos = digitSpacing * vec2(offs,0.0);
                    
                        dist = min(dist, dfDigit(pos, d, uv));
                        offs++;
                  }
                  return dist;	
                }

                float dfColon(vec2 origin, vec2 uv) {
                  uv -= origin;
                  float dist = 1e6;
                  float offs = 0.0;

                    dist = min(dist, dfCircle(vec2(offs+0.9,0.9)*1.1, 0.04,uv));
                    dist = min(dist, dfCircle(vec2(offs+0.9,0.4)*1.1, 0.04,uv));
                    return dist;
                }

                //Length of a number in digits
                float numberLength(float n)
                {
                  return floor(max(log(n) / log(10.0), 0.0) + 1.0) + 2.0;
                }

                void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
                {
                  // Test outside the circle for round watches
                  /*vec2 uvTest = (gl_FragCoord.xy-.5*iResolution.xy)/iResolution.y;

                  float absX = uvTest.x*uvTest.x;
                  float absY = uvTest.y*uvTest.y;
                  if(sqrt(absX + absY) >0.5) {
                    fragColor = vec4(0.1);
                    return;
                  }*/
                  // end test
                  
                  vec2 aspect = iResolution.xy / iResolution.y;
                  vec2 uv = (fragCoord.xy / iResolution.y - aspect/2.0) *0.86;
                  
                    
                    int hour = int(iDate.w/3600.);
                #if TWELVE_HOUR_CLOCK
                    if( hour > 12 ) hour -= 12;
                    if( hour == 0 ) hour = 12;
                #endif
                    int minute = int(mod(iDate.w/60.,60.));
                    
                  float nsize = numberLength(9999.);
                  vec2 pos = -digitSpacing * vec2(nsize,1.0)/2.0;

                    vec2 basepos = pos;
                    pos.x = basepos.x + 0.16;
                  float dist = 1e6;
                  dist = min(dist, dfNumberInt(pos, hour, uv));
                    
                    pos.x = basepos.x + 0.39;
                  dist = min(dist, dfColon( pos, uv ));
                    
                    pos.x = basepos.x + 0.60;
                    float dist2 = 1e6;
                  dist = min(dist, dfNumberInt(pos, minute, uv));
                  
                  vec3 color = vec3(0);
                  
                  float shade = 0.0;
                  
                  shade = 0.004 / (dist);
                  
                  color += vec3(1,0.2,0) * shade;
                #if GLOWPULSE
                  color += vec3(1,0.2,0) * shade * noise((uv + vec2(iTime*.5)) * 2.5 + .5);// * 10.*(noise(uv.yx));
                #endif

                    #ifdef SHOW_GRID
                    float grid = 0.5-max(abs(mod(uv.x*64.0,1.0)-0.5), abs(mod(uv.y*64.0,1.0)-0.5));
                    
                    color *= 0.25+vec3(smoothstep(0.0,64.0 / iResolution.y,grid))*0.75;
                    #endif
                  
                  fragColor = vec4( color , 1.0 );
                }`
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
                var vs = this.vertexShaderSource;
                var fs = this.fragmentShaderSource.replace('<!-- insert here -->', this.NixieTubeClock);

                const program = webglUtils.createProgramFromSources(gl, [vs, fs]);

                var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

                // look up uniform locations
                const resolutionLocation = gl.getUniformLocation(program, "iResolution");
                const mouseLocation = gl.getUniformLocation(program, "iMouse");
                const timeLocation = gl.getUniformLocation(program, "iTime");
                const dateLocation = gl.getUniformLocation(program, "iDate");

                var vao = gl.createVertexArray();
                gl.bindVertexArray(vao);

                var positionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                // fill it with a 2 triangles that cover clip space
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                    -1, -1,  // first triangle
                    1, -1,
                    -1,  1,
                    -1,  1,  // second triangle
                    1, -1,
                    1,  1,
                ]), gl.STATIC_DRAW);

                gl.enableVertexAttribArray(positionAttributeLocation);

                var size = 2;          // 2 components per iteration
                var type = gl.FLOAT;   // the data is 32bit floats
                var normalize = false; // don't normalize the data
                var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
                var offset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
                
                webglUtils.resizeCanvasToDisplaySize(gl.canvas);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                //const playpauseElem = document.querySelector('.playpause');
                const inputElem = document.querySelector('#canvas_container');
                // inputElem.addEventListener('mouseover', requestFrame);
                // inputElem.addEventListener('mouseout', cancelFrame);

                let mouseX = 0;
                let mouseY = 0;

                function setMousePosition(e) {
                    const rect = inputElem.getBoundingClientRect();
                    mouseX = e.clientX - rect.left;
                    mouseY = rect.height - (e.clientY - rect.top) - 1;  // bottom is 0 in WebGL
                }

                inputElem.addEventListener('mousemove', setMousePosition);
                inputElem.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    //playpauseElem.classList.add('playpausehide');
                    // requestFrame();
                }, {passive: false});
                inputElem.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    setMousePosition(e.touches[0]);
                }, {passive: false});
                inputElem.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    //playpauseElem.classList.remove('playpausehide');
                    // cancelFrame();
                }, {passive: false});

                // let requestId;
                // function requestFrame() {
                //     if (!requestId) {
                //     requestId = requestAnimationFrame(render);
                //     }
                // }
                // function cancelFrame() {
                //     if (requestId) {
                //     cancelAnimationFrame(requestId);
                //     requestId = undefined;
                //     }
                // }

                let then = 0;
                let time = 0;
                const midnight = new Date().setHours(0,0,0,0);
                function render(now) {
                    // requestId = undefined;
                    now *= 0.001;  // convert to seconds
                    const elapsedTime = Math.min(now - then, 0.1);
                    time += elapsedTime;
                    then = now;

                    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

                    // Tell WebGL how to convert from clip space to pixels
                    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                    // Tell it to use our program (pair of shaders)
                    gl.useProgram(program);

                    // Bind the attribute/buffer set we want.
                    gl.bindVertexArray(vao);

                    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
                    gl.uniform2f(mouseLocation, mouseX, mouseY);
                    gl.uniform1f(timeLocation, time);
                    let date = new Date();
                    gl.uniform4f(dateLocation, 0, 0, 0, (date-midnight)/1000)

                    gl.drawArrays(
                        gl.TRIANGLES,
                        0,     // offset
                        6,     // num vertices to process
                    );

                    requestAnimationFrame(render);
                }
                requestAnimationFrame(render);
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