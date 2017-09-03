/**
 * Camera for rendering in HoloJS framework (https://github.com/Microsoft/HoloJS)
 * @author sjando <stuart.anderson@data61.csiro.au>
 */
import { Camera, Matrix4 } from 'three';

export class HolographicCamera extends Camera {
    
    constructor () {
        super();

        this.type = 'HolographicCamera';
        this.isHolographicCamera = true;

        this._holographicViewMatrix = new Matrix4();
        this._holographicTransformMatrix = new Matrix4();
        this._holographicProjectionMatrix = new Matrix4();
    }

    update () {
        if (!window.experimentalHolographic) return;

        let params = window.getHolographicCameraParameters();

        // view matrix
        this._holographicViewMatrix.fromArray(params.mid.viewMatrix); // store
        this._holographicTransformMatrix.getInverse(this._holographicViewMatrix); // invert
        this._holographicTransformMatrix.decompose(this.position, this.quaternion, this.scale); // decompose

        // projection matrix
        this._holographicProjectionMatrix.fromArray(params.mid.projectionMatrix); // store
        this.projectionMatrix.copy(this._holographicProjectionMatrix); // copy
        // TODO: Extend PerspectiveCamera and decompose fov, aspect, near, far values
    }
};

export default HolographicCamera;