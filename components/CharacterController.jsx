import { Airplane } from "./Airplane"
import { useKeyboardControls } from "@react-three/drei"
import { Controls } from "./Experience";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "@/hooks/useGameState";
import { Vector3 } from 'three';

import { RigidBody, euler, quat } from "@react-three/rapier";


const MOVEMENT_SPEED = 4.2;
const JUMP_FORCE = 8;
const ROTATION_SPEED = 2.5;
const vel = new Vector3();

export const CharacterController = ({
    player = false,
    controls,
    state,
    ...props
}) => {
    const { stage } = useGameState();
    const [, get] = useKeyboardControls();
    const rb = useRef();



    useFrame(({ camera }) => {
        if (stage === "lobby") {
            return;
        }
        if (stage !== "game") {
            return;
        }

        // if (!player) {
        //     const pos = state.getState("pos");
        //     if (pos) {
        //         rb.current.setTranslation(pos);
        //     }
        //     const rot = state.getState("rot");
        //     if (rot) {
        //         rb.current.setRotation(rot);
        //     }
            
        //     return;
        // }

        const rotVel = {
            x: 0,
            y: 0,
            z: 0,
        };

        const curVel = rb.current.linvel();
        vel.x = 0;
        vel.y = 0;
        vel.z = 0;

        const angle = controls.angle();
        const joystickX = Math.sin(angle);
        const joystickY = Math.cos(angle);


        if (
            get()[Controls.forward] ||
            (controls.isJoystickPressed() && joystickY < -0.1)
        ) {
            vel.z += MOVEMENT_SPEED;
        }
        if (
            get()[Controls.back] ||
            (controls.isJoystickPressed() && joystickY > 0.1)
        ) {
            vel.z -= MOVEMENT_SPEED;
        }
        if (
            get()[Controls.left] ||
            (controls.isJoystickPressed() && joystickX < -0.1)
        ) {
            rotVel.y += ROTATION_SPEED;
        }
        if (
            get()[Controls.right] ||
            (controls.isJoystickPressed() && joystickX > 0.1)
        ) {
            rotVel.y -= ROTATION_SPEED;
        }

        rb.current.setAngvel(rotVel);
        // apply rotation to x and z to go in the right direction
        const eulerRot = euler().setFromQuaternion(quat(rb.current.rotation()));
        vel.applyEuler(eulerRot);

        rb.current.setLinvel(vel);
        state.setState("pos", rb.current.translation());
        state.setState("rot", rb.current.rotation());
    });

    return (
        <RigidBody {...props} ref={rb} canSleep={false}>
            <Airplane
                scale={0.015}
                color={state.state.profile.color}
                name={state.state.profile.name} />
        </RigidBody>

    )
}