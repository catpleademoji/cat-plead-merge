import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioContext } from "./hooks/useAudioContext";
import { loadSoundEffects } from "./types/assets/loadAssets";
import { DefaultResources, Engine, Schedules } from "cat-plead-engine";
import { AudioContext, GameState as GameStateRes, PopTimer, SoundEffectAssets } from "./game/resources";
import { addPhysicsResources } from "./game/resources/addPhysicsResources";
import { addWebglResources } from "./game/resources/addWebglResources";
import { addGameplayResources } from "./game/resources/addGameplayResources";
import { expDecay } from "./game/math";
import { gamelossUpdateGroup } from "./game/systems/gameloss";
import { mainUpdateGroup } from "./game/systems/main";
import { mainInitializationGroup } from "./game/systems/main/start";
import { MergeCatsSystem } from "./game/systems/MergeCatsSystem";
import { mainFixedUpdateGroup } from "./game/systems/physics";
import { RenderSystem } from "./game/systems/render/RenderSystem";
export function CatPleadMerge({ id, assets, theme }) {
    const engine = useRef(new Engine());
    const [score, setScore] = useState(0);
    const [isLoss, setIsLoss] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useAudioContext((audioContext) => {
        engine.current.addResource(AudioContext, audioContext);
        loadSoundEffects(assets.soundEffects, audioContext)
            .then(_soundEffects => {
            engine.current.addResource(SoundEffectAssets, _soundEffects);
        });
    });
    const getGameContainerRef = useCallback((gameContainer) => {
        if (gameContainer) {
            function onMouseDown(evt) {
                if (isLoss) {
                    return;
                }
                if (evt.button === 0) {
                    const mousedownEvents = engine.current.getResource("mousedownevents");
                    mousedownEvents === null || mousedownEvents === void 0 ? void 0 : mousedownEvents.enqueue({
                        x: evt.offsetX,
                        y: evt.offsetX,
                    });
                }
            }
            function onMouseUp(evt) {
                if (isLoss) {
                    return;
                }
                if (evt.button === 0) {
                    const mouseupEvents = engine.current.getResource("mouseupevents");
                    mouseupEvents === null || mouseupEvents === void 0 ? void 0 : mouseupEvents.enqueue({
                        x: evt.offsetX,
                        y: evt.offsetX,
                    });
                }
            }
            gameContainer.addEventListener("pointerdown", onMouseDown);
            gameContainer.addEventListener("pointerup", onMouseUp);
            return () => {
                gameContainer.removeEventListener("pointerdown", onMouseDown);
                gameContainer.removeEventListener("pointerup", onMouseUp);
            };
        }
    }, []);
    const getCanvasRef = useCallback((canvas) => {
        if (!canvas) {
            return;
        }
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
        }
        addWebglResources(engine.current, gl, assets)
            .then(() => {
            setIsLoading(false);
            engine.current.run();
        });
    }, []);
    useEffect(() => {
        addPhysicsResources(engine.current);
        addGameplayResources(engine.current, theme);
        addReactEventResources(engine.current);
        engine.current
            .addSystemGroup(Schedules.Start, mainInitializationGroup)
            .addSystemGroup(Schedules.Update, mainUpdateGroup)
            .addSystemGroup(Schedules.FixedUpdate, mainFixedUpdateGroup)
            .addSystem(Schedules.FixedUpdate, MergeCatsSystem)
            .addSystem(Schedules.Render, RenderSystem)
            .addSystemGroup(Schedules.Update, gamelossUpdateGroup);
    }, []);
    function addReactEventResources(engine) {
        engine.addResource("setScore", setScore);
        engine.addResource("setIsLoss", setIsLoss);
        engine.addSystem(Schedules.Update, {
            query: {
                resources: ["setScore", DefaultResources.Time, GameStateRes]
            },
            run(queryResult) {
                const setScore = queryResult.resources.getRW("setScore");
                const gameState = queryResult.resources.getRW(GameStateRes);
                const time = queryResult.resources.get(DefaultResources.Time);
                setScore((score) => {
                    return Math.floor(expDecay(score, gameState.score, 10, time.delta));
                });
            },
        })
            .addSystem(Schedules.Update, {
            query: {
                resources: [GameStateRes, "setIsLoss"],
            },
            run(queryResult) {
                const setIsLoss = queryResult.resources.getRW("setIsLoss");
                const gameState = queryResult.resources.getRW(GameStateRes);
                setIsLoss(gameState.isLoss);
            },
        });
    }
    function restart() {
        engine.current.clearEntities();
        mainInitializationGroup.resetSystems();
        const gameState = engine.current.getResource(GameStateRes);
        gameState.isLoss = false;
        gameState.score = 0;
        const popTimer = engine.current.getResource(PopTimer);
        popTimer.time = 0;
        setScore(0);
        setIsLoss(false);
    }
    return (_jsxs("div", { ref: getGameContainerRef, className: "game-container", children: [_jsx("div", { className: "game-ui-container", onPointerDown: (evt) => evt.preventDefault(), children: isLoading ?
                    (_jsx(_Fragment, { children: "Loading" })) :
                    (_jsxs("div", { children: [_jsxs("div", { children: ["Score: ", score] }), isLoss && (_jsx(_Fragment, { children: _jsx("button", { onClick: restart, children: "Play again" }) }))] })) }), _jsx("canvas", { id: id, ref: getCanvasRef })] }));
}
