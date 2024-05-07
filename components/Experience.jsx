
import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import { GameStateProvider } from "@/hooks/useGameState"
import { Game } from "./Game"
import { UI } from "./UI"
import { AudioManagerProvider } from "@/hooks/useAudioManager"
import { Physics } from "@react-three/rapier"
import { KeyboardControls } from "@react-three/drei"

export const Controls = {
    forward: "forward",
    back: "back",
    left: "left",
    right: "right",
    shoot: "shoot",
};

export const Experience = () => {

    const map = useMemo(
        () => [
            { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
            { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
            { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
            { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
            { name: Controls.jump, keys: ["Space"] },
        ],
        []
    );


    return (
        <>
            <KeyboardControls map={map}>
                <AudioManagerProvider>
                    <GameStateProvider>
                        <Canvas shadows>
                            <Suspense fallback={null}>
                                <Physics gravity={[0, 0, 0]} debug>
                                    <Game />
                                </Physics>
                            </Suspense>
                        </Canvas>
                        <UI />
                    </GameStateProvider>
                </AudioManagerProvider>
            </KeyboardControls>
        </>
    )
}