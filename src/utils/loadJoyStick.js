import {
    AdvancedDynamicTexture,
    Ellipse,
    Control
} from '@babylonjs/gui/2D';
import {
    Vector3,
    Matrix
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export const loadJoyStick = (scene, camera, canvas) => {
    
    let adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    let xAddPos = 0;
    let yAddPos = 0;
    let xAddRot = 0;
    let yAddRot = 0;
    let sideJoystickOffset = 350;
    let bottomJoystickOffset = -50;
    let translateTransform;


    let leftThumbContainer = makeThumbArea("leftThumb", 2, "blue", null);
    leftThumbContainer.height = "100px";
    leftThumbContainer.width = "100px";
    leftThumbContainer.isPointerBlocker = true;
    leftThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    leftThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    leftThumbContainer.alpha = 0.4;
    leftThumbContainer.left = sideJoystickOffset;
    leftThumbContainer.top = bottomJoystickOffset;

    let leftInnerThumbContainer = makeThumbArea("leftInnterThumb", 4, "blue", null);
    leftInnerThumbContainer.height = "80px";
    leftInnerThumbContainer.width = "80px";
    leftInnerThumbContainer.isPointerBlocker = true;
    leftInnerThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftInnerThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;


    let leftPuck = makeThumbArea("leftPuck", 0, "blue", "blue");
    leftPuck.height = "60px";
    leftPuck.width = "60px";
    leftPuck.isPointerBlocker = true;
    leftPuck.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftPuck.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;


    leftThumbContainer.onPointerDownObservable.add(function (coordinates) {
        leftPuck.isVisible = true;
        leftPuck.floatLeft = coordinates.x - (leftThumbContainer._currentMeasure.width * .5) - sideJoystickOffset;
        leftPuck.left = leftPuck.floatLeft;
        leftPuck.floatTop = adt._canvas.height - coordinates.y - (leftThumbContainer._currentMeasure.height * .5) + bottomJoystickOffset;
        leftPuck.top = leftPuck.floatTop * -1;
        leftPuck.isDown = true;
        leftThumbContainer.alpha = 0.9;
    });

    leftThumbContainer.onPointerUpObservable.add(function (coordinates) {
        xAddPos = 0;
        yAddPos = 0;
        leftPuck.isDown = false;
        leftPuck.isVisible = false;
        leftThumbContainer.alpha = 0.4;
    });


    leftThumbContainer.onPointerMoveObservable.add(function (coordinates) {
        if (leftPuck.isDown) {
            xAddPos = coordinates.x - (leftThumbContainer._currentMeasure.width * .5) - sideJoystickOffset;
            yAddPos = adt._canvas.height - coordinates.y - (leftThumbContainer._currentMeasure.height * .5) + bottomJoystickOffset;
            leftPuck.floatLeft = xAddPos;
            leftPuck.floatTop = yAddPos * -1;
            leftPuck.left = leftPuck.floatLeft;
            leftPuck.top = leftPuck.floatTop;
        }
    });

    adt.addControl(leftThumbContainer);
    leftThumbContainer.addControl(leftInnerThumbContainer);
    leftThumbContainer.addControl(leftPuck);
    leftPuck.isVisible = false;

    let rightThumbContainer = makeThumbArea("rightThumb", 2, "red", null);
    rightThumbContainer.height = "100px";
    rightThumbContainer.width = "100px";
    rightThumbContainer.isPointerBlocker = true;
    rightThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rightThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    rightThumbContainer.alpha = 0.4;
    rightThumbContainer.left = -sideJoystickOffset;
    rightThumbContainer.top = bottomJoystickOffset;

    let rightInnerThumbContainer = makeThumbArea("rightInnterThumb", 4, "red", null);
    rightInnerThumbContainer.height = "80px";
    rightInnerThumbContainer.width = "80px";
    rightInnerThumbContainer.isPointerBlocker = true;
    rightInnerThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    rightInnerThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;


    let rightPuck = makeThumbArea("rightPuck", 0, "red", "red");
    rightPuck.height = "60px";
    rightPuck.width = "60px";
    rightPuck.isPointerBlocker = true;
    rightPuck.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    rightPuck.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;


    rightThumbContainer.onPointerDownObservable.add(function (coordinates) {
        rightPuck.isVisible = true;
        rightPuck.floatLeft = adt._canvas.width - coordinates.x - (rightThumbContainer._currentMeasure.width * .5) - sideJoystickOffset;
        rightPuck.left = rightPuck.floatLeft * -1;
        rightPuck.floatTop = adt._canvas.height - coordinates.y - (rightThumbContainer._currentMeasure.height * .5) + bottomJoystickOffset;
        rightPuck.top = rightPuck.floatTop * -1;
        rightPuck.isDown = true;
        rightThumbContainer.alpha = 0.9;
    });

    rightThumbContainer.onPointerUpObservable.add(function (coordinates) {
        xAddRot = 0;
        yAddRot = 0;
        rightPuck.isDown = false;
        rightPuck.isVisible = false;
        rightThumbContainer.alpha = 0.4;
    });


    rightThumbContainer.onPointerMoveObservable.add(function (coordinates) {
        if (rightPuck.isDown) {
            xAddRot = adt._canvas.width - coordinates.x - (rightThumbContainer._currentMeasure.width * .5) - sideJoystickOffset;
            yAddRot = adt._canvas.height - coordinates.y - (rightThumbContainer._currentMeasure.height * .5) + bottomJoystickOffset;
            rightPuck.floatLeft = xAddRot * -1;
            rightPuck.floatTop = yAddRot * -1;
            rightPuck.left = rightPuck.floatLeft;
            rightPuck.top = rightPuck.floatTop;
        }
    });

    //leftThumbContainer.left = 50;
    adt.addControl(rightThumbContainer);
    rightThumbContainer.addControl(rightInnerThumbContainer);
    rightThumbContainer.addControl(rightPuck);
    rightPuck.isVisible = false;

    camera.attachControl(canvas, true);

    scene.registerBeforeRender(function () {
        // camera movement and rotation 
        translateTransform = Vector3.TransformCoordinates(new Vector3(xAddPos / 9000, 0, yAddPos / 9000), Matrix.RotationY(camera.rotation.y));
        camera.cameraDirection.addInPlace(translateTransform);
        camera.cameraRotation.y += xAddRot / 15000 * -1;
        camera.cameraRotation.x += yAddRot / 15000 * -1;
    });

    //creates the joystick ui
    function makeThumbArea(name, thickness, color, background, curves) {
        let rect = new Ellipse();
        rect.name = name;
        rect.thickness = thickness;
        rect.color = color;
        rect.background = background;
        rect.paddingLeft = "0px";
        rect.paddingRight = "0px";
        rect.paddingTop = "0px";
        rect.paddingBottom = "0px";




        return rect;
    }
}