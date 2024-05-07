import { Joystick, isHost, onPlayerJoin, useMultiplayerState } from "playroomkit";
import { useEffect } from "react";
import { useContext, createContext, useState, useRef } from "react";

const GameStateContext = createContext();

//Different Stages Of the Game APP
const NEXT_STAGE = {
    lobby: "countdown",
    countdown: "game",
    game: "winner",
    winner: "lobby",
};

//Timer Associated with the Stages
const TIMER_STAGE = {
    lobby: -1,          //allow to stay in lobby indefinetly
    countdown: 3,
    game: 0,            //timer will go up
    winner: 5,
};

export const GameStateProvider = ({ children }) => {
    const [stage, setStage] = useMultiplayerState("gameStage", "lobby");
    const [timer, setTimer] = useMultiplayerState("timer", TIMER_STAGE.lobby);
    const [players, setPlayers] = useState([]);
    const [soloGame, setSoloGame] = useState(false);

    const host = isHost();

    //PLAYER JOIN OR LEAVE LOGIC
    const isInit = useRef(false);
    useEffect(() => {
        if (isInit.current) {
            return;
        }
        isInit.current = true;
        onPlayerJoin((state) => {
            const controls = new Joystick(state, {
                type: "angular",
                buttons: [{ id: "Shoot", label: "Shoot" }],
            });
            const newPlayer = { state, controls };

            setPlayers((players) => [...players, newPlayer]);
            state.onQuit(() => {
                setPlayers((players) => players.filter((p) => p.state.id !== state.id));
            })
        });
    }, []);


    //TIMER LOGIC
    useEffect(() => {

        //ONLY HOST CONTROLS THE TIMER
        if (!host) {
            return;
        }
        //NO TIMER FOR LOBBY
        if (stage === "lobby") {
            return;
        }
        const timeout = setTimeout(() => {
            let newTime = stage === "game" ? timer + 1 : timer - 1;
            if(newTime === 0){
                const nextStage = NEXT_STAGE[stage];
                setStage(nextStage, true);
                newTime = TIMER_STAGE[nextStage];
            }
            setTimer(newTime, true);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [host, timer, stage, soloGame])

    const startGame = () => {
        setStage("countdown");
        setTimer(TIMER_STAGE.countdown);
        setSoloGame(players.length === 1);
    }

    return (
        <GameStateContext.Provider value={{
            stage,
            timer, 
            players,
            host,
            startGame,
        }}>
            {children}
        </GameStateContext.Provider>
    )
}

export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error("useGameState must be used within a GameStateProvider");
    }
    return context;
}