import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';


// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));
scene.background = new THREE.Color(0.5, 0.5, 0.5);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.PointLight(0xffffff, 10);
light.position.set(1.8, 1.4, 1.0);
scene.add(light);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

// Raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;

// Display hovered object's name
const infoDiv = document.createElement('div');
infoDiv.style.position = 'absolute';
infoDiv.style.top = '10px';
infoDiv.style.left = '10px';
infoDiv.style.color = 'white';
infoDiv.style.background = 'rgba(0, 0, 0, 0.5)';
infoDiv.style.padding = '5px';
infoDiv.style.fontSize = '14px';
document.body.appendChild(infoDiv);

// Handle mouse movement
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // Position the label next to the mouse pointer
  infoDiv.style.left = `${event.clientX + 10}px`; // Offset by 10px for better visibility
  infoDiv.style.top = `${event.clientY + 10}px`;
}
window.addEventListener('mousemove', onMouseMove);

// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  'skeleton.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.traverse((child) => {
      if (child.isMesh) {
        child.name = child.name || `Object_${child.id}`; // Ensure objects have unique names
      }
    });
    scene.add(model);
  },
  (xhr) => {
    if (xhr.lengthComputable) {
      // const percentComplete = (xhr.loaded / xhr.total) * 100;
      // console.log(`Loading progress: ${percentComplete.toFixed(2)}%`);
      // progressBar.style.width=percentComplete*0.5+'%'
      // if(percentComplete>=100)
      //   progressBar.style.display='none'
    }
  },
  (error) => {
    console.error(error);
  }
);

// Add stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Post-Processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const gtaoPass = new GTAOPass(scene, camera);
composer.addPass(gtaoPass);

const gui = new GUI();
gui.add(gtaoPass, 'output', {
  'Default': GTAOPass.OUTPUT.Default,
  'Diffuse': GTAOPass.OUTPUT.Diffuse,
  'AO Only': GTAOPass.OUTPUT.AO,
  'AO Only + Denoise': GTAOPass.OUTPUT.Denoise,
  'Depth': GTAOPass.OUTPUT.Depth,
  'Normal': GTAOPass.OUTPUT.Normal,
}).onChange((value) => {
  gtaoPass.output = value;
});

// Animation loop with raycasting
function animate() {
  requestAnimationFrame(animate);

  // Raycast and check intersections
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const firstIntersect = intersects[0].object;
    if (hoveredObject !== firstIntersect) {//遇到一个新物体
      if(hoveredObject&&hoveredObject.material.emissive)
        hoveredObject.material.emissive.setHex( 0x000000);

      hoveredObject = firstIntersect;
      infoDiv.textContent = `Hovered: ${hoveredObject.name}`;
      infoDiv.style.display='block'

      if(hoveredObject.material.emissive)
        hoveredObject.material.emissive.setHex( 0xFF0000);
    }
    
  }
  if(infoDiv.textContent=='Hovered: '){
    infoDiv.style.display='none'
  }
    

  controls.update();
  composer.render();
  stats.update();
}
animate();
