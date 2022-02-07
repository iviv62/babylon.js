
import {

    StandardMaterial,
    DynamicTexture,
    SceneLoader,
    ActionManager,
    ExecuteCodeAction,

} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { createMaskingScreen, createCSSobject, setupRenderer } from "../utils/cssVideoRenderer"

var youtubeFocused = false

export const loadScene = (scene) => {

    // Setup the CSS renderer for Youtube Videos
    let renderer = setupRenderer();

    SceneLoader.ImportMesh(
        "",
        "../../assets/",
        "expo3.glb",
        scene,
        (meshes) => {
            meshes.forEach(mesh => {

                //attach action to a mesh
                mesh.actionManager = new ActionManager(scene);
                mesh.actionManager.registerAction(
                    new ExecuteCodeAction({
                        // onPickTrigger is a click event
                        trigger: ActionManager.OnPickTrigger,

                    },
                    //when user clicks on the mesh this function will be called
                        function () {
                            //mesh.scaling.x = 0.1
                            //mesh.scaling.y = 0.1
                            //mesh.scaling.z = 0.1
                            console.log(mesh.name)

                        }
                    )
                )
             
                if (mesh.name.includes( "SM_SignBooth")) {
                    //Create dynamic texture
                    // let textureResolution = 512;
                    //this is how you can attach an image as a texture to a  mesh
                    //The image should be the proper size for the 3d object else it wont be mapped correctly
                    let texture = new DynamicTexture("dynamic texture",{width:490, height:400}, scene);
                    let textureContext = texture.getContext();
                    let material = new StandardMaterial("Mat", scene);
                    material.diffuseTexture = texture;
                    mesh.material = material;
                    let img = new Image();
                    img.crossOrigin = "anonymous"
                    img.src = 'https://i.imgur.com/pptYaRU.jpg';
                   
                   
                    img.onload = function () {
                        //Add image to dynamic texture
                        textureContext.drawImage(this, 120, 0);
                        texture.update();

                    }

                    //attach action that opens an external link after the user has clicked on the mesh
                    mesh.actionManager.registerAction(
                        new ExecuteCodeAction({
                            trigger: ActionManager.OnPickTrigger,
    
                        },
                            function () {
                                window.open("https://www.limmert.com")
    
                            }
                        )
                    )

                }

    

                if (mesh.name === "Screen2") {

                    //create Youtube object and attach it to the mesh
                    //3rd parameter is the id of the youtube video
                    createCSSobject(mesh, scene, 'cBh047dcdhQ', renderer);
                    createMaskingScreen(mesh, scene, scene.getEngine(), renderer)
                    
                    //  toggles on/off pointer events to body so you can use the youtube screen
                    let listener = function (evt) {
                        let pick = scene.pick(Math.round(evt.offsetX), Math.round(evt.offsetY));
                        if (pick.hit) {
                            if (pick.pickedMesh.name === mesh.name) {
                                if (!youtubeFocused) {
                                    youtubeFocused = true

                                    document.getElementsByTagName('body')[0].style.pointerEvents = 'none'
                                }
                            } else {

                                youtubeFocused = false
                                document.getElementsByTagName('body')[0].style.pointerEvents = 'auto'
                            }
                        }
                    }

                    window.addEventListener('pointermove', listener);
                    window.addEventListener('pointerdown', listener);
                    window.addEventListener('pointerup', listener);


                }

                //add collisions
                mesh.collisionsEnabled = true
                mesh.checkCollisions = true;


            })
        }
    );


};