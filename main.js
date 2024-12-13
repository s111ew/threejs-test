import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color().setHex(0xddded5);
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const loader = new GLTFLoader();
loader.load(
  "assets/model/untitled.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.rotation.y = Math.PI / -2;
    scene.add(model);
    window.addEventListener("mousemove", (e) => {
      const middlePoint = window.innerWidth / 2;
      const mousePositionX = e.clientX;

      // Map the mouse position to a rotation angle
      const rotationFactor = (mousePositionX - middlePoint) / middlePoint / 2;
      model.rotation.y = rotationFactor * Math.PI;
    });
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.z = 5;
camera.position.y = 1.5;

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  renderer.render(scene, camera);
}
