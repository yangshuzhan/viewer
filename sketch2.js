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
scene.background = new THREE.Color(0.0, 0.0, 0.0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.PointLight(0xffffff, 10);
light.position.set(1.8, 1.4, 1.0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  'model.glb',
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


// Animation loop with raycasting
function animate() {
  requestAnimationFrame(animate);

  // Raycast and check intersections

    
  light.position.copy(camera.position);
  controls.update();
  composer.render();
  stats.update();
}
animate();
