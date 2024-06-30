import { AmbientLight, BoxGeometry, CameraHelper, DirectionalLight, Mesh, MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";
import { World } from "./WorldGen/World";
import { createUi } from "./ui/Ui";
import Stats from "three/examples/jsm/libs/stats.module.js";

const stats = new Stats();
document.body.append(stats.dom);

const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor("skyBlue");
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

//setting up camera
const camera = new PerspectiveCamera(75, innerWidth / innerHeight);
camera.position.set(-32, 16, -32);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16, 0, 16);
controls.update();

//scene setup
const scene = new Scene();
const world = new World({ width: 28, height: 28 });
world.generate();

scene.add(world);

function animate() {
	requestAnimationFrame(animate);
	// cube.rotation.x += 0.01;
	renderer.render(scene, camera);
	stats.update();
}

function setupLights() {
	const sun = new DirectionalLight();
	sun.intensity = 5;
	sun.position.set(50, 50, 50);
	sun.castShadow = true;

	// Set the size of the sun's shadow box
	sun.shadow.camera.left = -40;
	sun.shadow.camera.right = 40;
	sun.shadow.camera.top = 40;
	sun.shadow.camera.bottom = -40;
	sun.shadow.camera.near = 0.1;
	sun.shadow.camera.far = 200;
	sun.shadow.bias = -0.0001;
	sun.shadow.mapSize = new Vector2(512, 512);
	scene.add(sun);
	scene.add(sun.target);

	const shadowHelper = new CameraHelper(sun.shadow.camera);
	scene.add(shadowHelper);

	const ambient = new AmbientLight();
	ambient.intensity = 0.2;
	scene.add(ambient);
}

window.addEventListener("resize", () => {
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);
});

setupLights();
createUi(world);
animate();
