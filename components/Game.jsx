import { Environment, PerspectiveCamera, OrbitControls } from "@react-three/drei"
import { SphereEnv } from "./SphereEnv"
import { Landscape } from "./Landscape"
import { CharacterController } from "./CharacterController"
import { useGameState } from "@/hooks/useGameState"
import { myPlayer } from "playroomkit"
import { Airplane } from "./Airplane"

export const Game = () => {
    
    const {players, stage} = useGameState();
    const me = myPlayer();
    return (
        <>
            <SphereEnv />
            <Environment background={false} files={"textures/envmap.hdr"} />
            <PerspectiveCamera makeDefault position={[0, 10, 10]} />
            <OrbitControls target={[0, 0, 0]} />
            
            

            <>
                {stage !== "lobby" && <Landscape />}
                {players.map(({state, controls}) => (
                    <CharacterController 
                    key={state.id}
                    state={state}
                    controls={controls}
                    player={me.id === state.id}
                    position-y={3}
                    />
                    
                ))}
            </>

            <directionalLight
                castShadow
                color={"#f3d29a"}
                intensity={2}
                position={[10, 5, 4]}
                shadow-bias={-0.0005}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.01}
                shadow-camera-far={20}
                shadow-camera-top={6}
                shadow-camera-bottom={-6}
                shadow-camera-left={-6.2}
                shadow-camera-right={6.4}
            />
        </>
    )
}