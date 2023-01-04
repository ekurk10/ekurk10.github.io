console.log("test1");
import * as THREE from "three"; // Imports Three.js
console.log("test2");
import {OrbitControls} from "three/addons/controls/OrbitControls.js"; //Imports Camera Controls
console.log("test3");
import {FontLoader} from "three/addons/loaders/FontLoader.js"; //Imports Font Loader to load fonts
console.log("test4");
import {TextGeometry} from "three/addons/geometries/TextGeometry.js"; // Imports TextGeometry to display fonts
console.log("test5");
import * as YUKA from "yuka"; // Imports Yuka
console.log("test6");

export default THREE;

//Creates a new Three.js scene
const scene = new THREE.Scene();

//Creates the orbiting "sphere", manipulated to be a spinning top
const sphereGeometry = new THREE.SphereGeometry(0.5, 100, 1);
const sphereMaterial = new THREE.MeshNormalMaterial({
    wireframe: true,
    side: THREE.BackSide,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.matrixAutoUpdate = false;
scene.add(sphere);

//Creates and loads the text that will be displayed
const loader = new FontLoader();

loader.load("node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json", function (droidFont) {

	const textGeometry = new TextGeometry("Meet Eric", {
		font: droidFont,
		size: 2,
        height: 0.5,
	});
    const textMaterial = new THREE.MeshStandardMaterial({
        wireframe: true,
        emissive: new THREE.Color("#ffffff"),
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = -5.7;
    scene.add(textMesh);
});

const loader2 = new FontLoader();

loader2.load("node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json", function (droidFont) {

	const geometry = new TextGeometry("Aspiring Software Developer", {
		font: droidFont,
		size: 0.5,
        height: 0.1,
	});
    const textMaterial = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        wireframe: true,
        emissive: new THREE.Color("#ffffff"),
    });
    const textMesh = new THREE.Mesh(geometry, textMaterial);
    textMesh.position.x = -4;
    textMesh.position.y = -2.5;
    scene.add(textMesh);
});

//Creates a light source to view the objects
const light = new THREE.PointLight(0xffffff, 0.9, 100);
light.position.set(0, 10, 10);
scene.add(light);

//Creates the camera, scalable to the window size
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// Maps out the path for the object to orbit around the text
const vehicle = new YUKA.Vehicle();
vehicle.setRenderComponent(sphere, (object, renderComponent) => {
    renderComponent.matrix.copy(object.worldMatrix);
});

const path = new YUKA.Path();
path.add(new YUKA.Vector3(-7, -1.5, -1.5));
path.add(new YUKA.Vector3(0, -0.2, -1.8));
path.add(new YUKA.Vector3(9, 2.5, -1.5));
path.add(new YUKA.Vector3(9, 2.5, 1.5));
path.add(new YUKA.Vector3(0, -0.2, 1.8));
path.add(new YUKA.Vector3(-7, -1.5, 1.5));

path.loop = true;

vehicle.position.copy(path.current());

const followPathBehavior = new YUKA.FollowPathBehavior(path, 5);
vehicle.steering.add(followPathBehavior);

vehicle.maxSpeed = 10;

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

const time = new YUKA.Time();

//Renderer
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Camera Controls
const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;

//Adjusts canvas if the window is resized
window.addEventListener("resize", () => {
    camera.updateProjectionMatrix();
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
    const timeChange = time.update().getDelta();
    entityManager.update(timeChange);
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
};

animate();