import { Matrix4, Camera } from 'three';

/**
 * Camera for rendering in HoloJS framework (https://github.com/Microsoft/HoloJS)
 * Use for both auto-stereo and advanced mode
 * @author Stuart Anderson <stuart.anderson@data61.csiro.au>
 */
export class HolographicCamera extends Camera {

    constructor () {
        super();

        this.type = 'HolographicCamera';
        this.isHolographicCamera = true;

        this.left = new Camera();
        this.right = new Camera();

        // [0 = left, 1 = mid, 2 = right]
        this._cameraMap = [this.left, this, this.right];

        this._holographicViewMatrix = [new Matrix4(), new Matrix4(), new Matrix4()];
        this._holographicTransformMatrix = [new Matrix4(), new Matrix4(), new Matrix4()];
        this._holographicProjectionMatrix = [new Matrix4(), new Matrix4(), new Matrix4()];
    }

    update () {

        if (!window.experimentalHolographic) return;

        // retrieve latest camera parameters
        let params = window.getHolographicCameraParameters();
        this._holographicViewMatrix[0].fromArray(params.left.viewMatrix);
        this._holographicViewMatrix[1].fromArray(params.mid.viewMatrix);
        this._holographicViewMatrix[2].fromArray(params.right.viewMatrix);
        this._holographicProjectionMatrix[0].fromArray(params.left.projectionMatrix);
        this._holographicProjectionMatrix[1].fromArray(params.mid.projectionMatrix);
        this._holographicProjectionMatrix[2].fromArray(params.right.projectionMatrix);

        // apply view matrices
        this._holographicViewMatrix.forEach((viewMatrix, i) => {
            this._holographicTransformMatrix[i].getInverse(viewMatrix); // invert
            this._holographicTransformMatrix[i].decompose(this._cameraMap[i].position, this._cameraMap[i].quaternion, this._cameraMap[i].scale); // decompose
        });

        // apply projection matrices
        this._holographicProjectionMatrix.forEach((projectionMatrix, i) => {
            this._cameraMap[i].projectionMatrix.copy(projectionMatrix); // store
            // TODO: Each camera should extend PerspectiveCamera and decompose fov, aspect, near, far values
        });

        // update left/right cameras explicitly if they are not part of scene graph
        if (this.left.parent === null) {
            this.left.updateMatrixWorld();
            this.left.matrixWorldInverse.copy(this._holographicViewMatrix[0]);
        }
        if (this.right.parent === null) {
            this.right.updateMatrixWorld();
            this.right.matrixWorldInverse.copy(this._holographicViewMatrix[2]);
        }
    }
}

export default HolographicCamera;