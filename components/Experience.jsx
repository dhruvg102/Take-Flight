
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Game } from "./Game"
export const Experience = () => {
    return(
        <>
            <Canvas shadows>
                <Suspense fallback={null}>
                    <Game />
                </Suspense>
            </Canvas>
        </>
    )
}