import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { KeyController } from './KeyController';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();

// Boundary
const boundary = {
	minX: -15,
	maxX: 15,
	minZ: -15,
	maxZ: 15,
};

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 1);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

// floor
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Controls
const controls = new PointerLockControls(camera, renderer.domElement);
const gravity = 9.8;
let velocity = new THREE.Vector3();
let canJump = false;

controls.domElement.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => console.log("lock!"));
controls.addEventListener('unlock', () => 	console.log("unlock!"));

// 키보드 컨트롤
const keyController = new KeyController();

const walk = (delta) => {
	if(keyController.keys['KeyW'] || keyController.keys['ArrowUp']){
		controls.moveForward(0.02);
	};
	if(keyController.keys['KeyS'] || keyController.keys['ArrowUDown']){
		controls.moveForward(-0.02);
	};
	if(keyController.keys['KeyA'] || keyController.keys['ArrowLeft']){
		controls.moveRight(-0.02);
	};
	if(keyController.keys['KeyD'] || keyController.keys['ArrowRight']){
		controls.moveRight(0.02);
	};
	if(keyController.keys['Space']){
		if (canJump) velocity.y +=  5;
		// velocity.y +=  0.5; // 연속 점프
		canJump = false;
	};

	if (!canJump) {
		velocity.y -= gravity * delta;
	};
	camera.position.y += velocity.y * delta;

	if (camera.position.y < 1) {
		velocity.y = 0;
		camera.position.y = 1;
		canJump = true;
	};

	// **카메라 위치 제한 적용**
	if (camera.position.x < boundary.minX) camera.position.x = boundary.minX;
	if (camera.position.x > boundary.maxX) camera.position.x = boundary.maxX;
	if (camera.position.z < boundary.minZ) camera.position.z = boundary.minZ;
	if (camera.position.z > boundary.maxZ) camera.position.z = boundary.maxZ;
};

// GUI
const gui = new GUI();
const cameraGui = gui.addFolder('Camera');
cameraGui.add(camera.position, 'x', -15, 15, 0.001);
cameraGui.add(camera.position, 'y', -15, 15, 0.001);
cameraGui.add(camera.position, 'z', -15, 15, 0.001);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
let mesh;
for(let i = 0; i < 20; i++){
	const material = new THREE.MeshStandardMaterial({
		// 최소 50 부터, 너무 어두운 색이면 배경색때문에 안보임
		color: `rgb(
			${50 + Math.floor(Math.random() * 205)}, 
			${50 + Math.floor(Math.random() * 205)},
			${50 + Math.floor(Math.random() * 205)}
		)`
	});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = (Math.random() - 0.5) * 5;
	mesh.position.y = (Math.random() - 0.5) * 5;
	mesh.position.z = (Math.random() - 0.5) * 5;
	scene.add(mesh);
};

// 그리기
const clock = new THREE.Clock();

const draw = () => {
	const delta = clock.getDelta();

	walk(delta);

	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

const setSize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);

draw();