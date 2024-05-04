import { useTexture } from "@react-three/drei";
import { BackSide } from "three";

export const SphereEnv = () => {
    const map = useTexture("textures/envmap.jpg");

    return (
        <mesh>
            <sphereGeometry args={[60, 50, 50]} />
            <meshBasicMaterial
                side={BackSide}
                map={map}
            />
        </mesh>
    )
}