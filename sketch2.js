import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));
scene.background = new THREE.Color(0.0, 0.0, 0.0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20);
camera.position.set(1, 6.9, 5.6);
camera.lookAt(new THREE.Vector3(100,0,0)) ;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.PointLight(0xffffff, 5);
light.castShadow=false;
light.position.set(1.8, 1.4, 1.0);
scene.add(light);

const ambientLight = new THREE.HemisphereLight( 0xcf5f2b, 0xcf5f2b, 0.1 );
scene.add(ambientLight);
light.shadow.camera=camera;

// Add controls
const controls = new PointerLockControls( camera, renderer.domElement );

// add event listener to show/hide a UI (e.g. the game's menu)

// controls.addEventListener( 'lock', function () {

// 	menu.style.display = 'none';

// } );

// controls.addEventListener( 'unlock', function () {

// 	menu.style.display = 'block';

// } );
const raycaster = new THREE.Raycaster();
const onKeyDown = function (event) {
  let direction=controls.getDirection(new THREE.Vector3())
  switch (event.code) {
    case 'KeyW':
      camera.position.addScaledVector( camera.getWorldDirection( direction ), 0.05 );
      break;
    case 'KeyA': 
      controls.moveRight(-0.05);
      break;
    case 'KeyS':
      controls.moveForward(-0.05);
      break;
    case 'KeyD':
      controls.moveRight(0.05);
      break;
    case 'KeyZ':
      controls.lock()
      break;
  }
};
document.addEventListener('keydown', onKeyDown, false)
let isLeftMouseDown = false;
let isRightMouseDown = false;

// 监听鼠标按下
document.addEventListener('mousedown', (event) => {
  if (event.button === 0) {       // 左键
    controls.lock()
    isLeftMouseDown = true;
  } else if (event.button === 2) { // 右键
    isRightMouseDown = true;
  }
});

// 监听鼠标抬起
document.addEventListener('mouseup', (event) => {
  if (event.button === 0) {
    isLeftMouseDown = false;
  } else if (event.button === 2) {
    isRightMouseDown = false;
  }
});
// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  'model.glb',
  (gltf) => {
    console.log(gltf)
    // texture.colorSpace = THREE.SRGBColorSpace;
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.traverse((child) => {
      if (child.isMesh) {
        console.log(child)
        // let temp=new THREE.MeshPhongMaterial
        // temp.map=child.material.map
        child.material.roughness=0.1;
        // child.material.shininess=300
        // child.material.specular=new THREE.Color(.5, .5, .5);

        new THREE.TextureLoader().load('IntestinesC.jpg', function (texture) {  // 加载成功后的回调函数
          child.material.map=texture;
          texture.colorSpace='srgb';
          texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.flipY=false
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
        });
        new THREE.TextureLoader().load('IntestinesB.jpg',  function (texture) {  // 加载成功后的回调函数
          child.material.bumpMap=texture;
          texture.colorSpace='srgb';
          texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.flipY=false
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
        });
        child.material.bumpScale=5
        child.material.needsUpdate=true;
        // child.material.map.anisotropy=renderer.capabilities.getMaxAnisotropy() 
        // child.material.map.minFilter=THREE.NearestFilter
        // child.material.map.maxFilter=THREE.LinearFilter
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
let point=document.getElementById('point');

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

let lastdistance=0,lastcamera=camera.position;
// Animation loop with raycasting
let minx=Infinity,maxx=0
function animate() {
  requestAnimationFrame(animate);
  controls.update(0.5);
  if (isLeftMouseDown) {
    // 例如，让相机向前移动
    let direction = controls.getDirection(new THREE.Vector3());
    camera.position.addScaledVector(camera.getWorldDirection(direction), 0.05);
  }

  // 如果右键被按住，就执行另一段逻辑
  if (isRightMouseDown) {
    // 例如，让相机向后移动
    let direction = controls.getDirection(new THREE.Vector3());
    camera.position.addScaledVector(camera.getWorldDirection(direction), -0.05);
  }
  lastcamera=camera.position;
  // console.log(camera.position)
  // Raycast and check intersections
  raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
  let intersects = raycaster.intersectObjects(scene.children, true)
  let direction = new THREE.Vector3(); // create once and reuse it!
    camera.getWorldDirection( direction );
    // console.log(direction)
    // controls.target=(camera.position);
  if (intersects.length > 0) {
  // controls.cursor.copy(intersects[0].point);
    
      if (intersects[0].distance <0.5) {
        console.log(intersects[0])
        camera.position.copy(camera.position.multiplyScalar(1.2).addScaledVector(intersects[0].point,-0.2));
        console.log(intersects[0].distance,intersects[0].normal); 
        }
        
      }
  
  raycaster.set(camera.position,direction.multiplyScalar(-1));
  intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    
    if (intersects[0].distance <0.5) {
      console.log(intersects[0])
      camera.position.copy(camera.position.multiplyScalar(1.2).addScaledVector(intersects[0].point,-0.2));
      console.log(intersects[0].distance,intersects[0].normal); 
      }
      
    }
  light.position.copy(camera.position,direction);
  // console.log(light.shadow.camera.position)
  point.style.right=(camera.position.x+11.7)/24*300+'px';
  point.style.bottom=(camera.position.y+19.9)/32*200+'px';
  composer.render();
  if(camera.position.y<minx)minx=camera.position.y
  if(camera.position.y>maxx)maxx=camera.position.y
  // console.log(minx,maxx)
  
  stats.update();
}
animate();
