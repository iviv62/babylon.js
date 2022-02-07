import React from 'react'

import SceneComponent from '../components/SceneComponent';
import { loadScene } from '../utils/loadScene.';
import { loadJoyStick } from '../utils/loadJoyStick';

import "@babylonjs/loaders/OBJ";

import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Color4,
    Color3,
    StandardMaterial,
    CubeTexture,
    Texture,
  
} from "@babylonjs/core";




const onSceneReady = (scene) => {
    const engine = scene.getEngine()
    const canvas = scene.getEngine().getRenderingCanvas();
    //display loading screen -> babylon logo
    engine.displayLoadingUI();

    // This creates and positions a free(first person view) camera (non-mesh)
    let camera = new FreeCamera("camera1", new Vector3(-5, 1.5, -2), scene);
    //ClearColor is needed in order to render video correctly
    scene.clearColor = new Color4(0, 0, 0, 0);
    //Arrow Keys
    camera.attachControl(true);
    //Controls  WASD
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    camera.keysLeft.push(65);
    //Movement speed
    camera.speed = 0.2


    
    // Skybox
    let skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    let skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("../../assets/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    //loop throught the meshesh , set collisions and load scene from editor
    loadScene(scene);
    loadJoyStick(scene, camera, canvas)


    //camera.inputs.attached.keyboard.detachControl();
    //Set gravity for the scene (G force like, on Y-axis)/ can be used for jumping in order to fall down after some time
    scene.gravity = new Vector3(0, -0.2, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;

    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;

    //Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new Vector3(1, 1.3, 1);


    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);


    // The CSS object will follow this mesh
    /*var plane = MeshBuilder.CreatePlane("youtube", {width: 1, height: 1}, scene);
    plane.scaling.x = 6
    plane.scaling.y = 4
    plane.position.x=-6
    plane.position.y=5*/

    // Setup the CSS renderer and Youtube object
    //let renderer = setupRenderer();
    //createCSSobject(plane, scene, 'cBh047dcdhQ', renderer);
    //createMaskingScreen(plane, scene,scene.getEngine(), renderer)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;





}

const onRender = (scene) => {
        scene.getEngine().hideLoadingUI();
};

const Scene2 = () => {
 
   
    return (
     <div id='canvasZone'>
     <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" /> 
     </div>
    )
  }
  
export default Scene2