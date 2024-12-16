import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
renderer.shadowMap.enabled = true; // Enable shadow maps
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5); // Adjust the light position to cast shadows
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

let model; // Declare a variable to hold the loaded model

const loader = new GLTFLoader();
loader.load(
  "assets/model/untitled.gltf",
  function (gltf) {
    model = gltf.scene;

    model.castShadow = true; // Enable shadow casting for the model
    model.receiveShadow = true; // Allow the model to receive shadows
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Create the plane beneath the model
const planeGeometry = new THREE.PlaneGeometry(100, 100); // Large plane to cover the model's area
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Material to make it look like the ground
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
plane.position.y = 1; // Position the plane beneath the model
plane.receiveShadow = true; // Make the plane receive shadows
scene.add(plane);

camera.position.z = 5;
camera.position.y = 1.5;

let mouse = new THREE.Vector2();
let mouse3D = new THREE.Vector3();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("mousemove", onMouseMove);

function updateModelLookAt() {
  if (model) {
    // Convert mouse 2D position to 3D position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersectPoint = raycaster.ray.at(10, mouse3D);

    const direction = intersectPoint.sub(model.position).normalize();

    // Apply the initial rotation correction (account for the initial -90 degree rotation)
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationY(Math.PI / -2); // Apply the initial rotation
    direction.applyMatrix4(rotationMatrix);

    // Calculate the new rotation for the model based on the mouse direction
    model.rotation.y = Math.atan2(-direction.x, direction.z);
  }
}

function animate() {
  updateModelLookAt(); // Update model orientation
  renderer.render(scene, camera);
}
