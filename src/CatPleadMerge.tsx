import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { AssetManifest } from "./types/assets/AssetManifest";
import { useAudioContext } from "./hooks/useAudioContext";
import { loadSoundEffects } from "./types/assets/loadAssets";
import { DefaultResources, Engine, QueryResult, Schedules, Time } from "cat-plead-engine";
import { AudioContext, GameState as GameStateRes, PopTimer, SoundEffectAssets } from "./game/resources";
import { addPhysicsResources } from "./game/resources/addPhysicsResources";
import { addWebglResources } from "./game/resources/addWebglResources";
import { Theme } from "./types/Theme";
import { MouseDownEventQueue, MouseUpEventQueue } from "./game/types/MouseEvent";
import { addGameplayResources } from "./game/resources/addGameplayResources";
import { GameState } from "./game/types/GameState";
import { expDecay } from "./game/math";
import { gamelossUpdateGroup } from "./game/systems/gameloss";
import { mainUpdateGroup } from "./game/systems/main";
import { mainInitializationGroup } from "./game/systems/main/start";
import { MergeCatsSystem } from "./game/systems/MergeCatsSystem";
import { mainFixedUpdateGroup } from "./game/systems/physics";
import { RenderSystem } from "./game/systems/render/RenderSystem";
import { Timer } from "./game/types/Timer";

export type CatPleadMergeProps = {
  id: string;
  assets: AssetManifest;
  theme: Theme
}

export function CatPleadMerge({ id, assets, theme }: CatPleadMergeProps) {
  const engine = useRef<Engine>(new Engine({ maxTimestep: 1 / 60, fixedTimestep: 1 / 60 }));

  const [score, setScore] = useState<number>(0);
  const [isLoss, setIsLoss] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useAudioContext((audioContext) => {
    engine.current.addResource(AudioContext, audioContext);
    loadSoundEffects(assets.soundEffects, audioContext)
      .then(_soundEffects => {
        engine.current.addResource(SoundEffectAssets, _soundEffects);
      });
  });

  const getGameContainerRef = useCallback((gameContainer: HTMLDivElement | null) => {
    if (gameContainer) {
      function onMouseDown(evt: PointerEvent) {
        if (isLoss) {
          return;
        }

        if (evt.button === 0) {
          const mousedownEvents = engine.current.getResource<MouseDownEventQueue>("mousedownevents");
          mousedownEvents?.enqueue({
            x: evt.offsetX,
            y: evt.offsetX,
          });
        }
      }

      function onMouseUp(evt: PointerEvent) {
        if (isLoss) {
          return;
        }

        if (evt.button === 0) {
          const mouseupEvents = engine.current.getResource<MouseUpEventQueue>("mouseupevents");
          mouseupEvents?.enqueue({
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
      }
    }
  }, []);

  const getCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
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
      .addSystemGroup(Schedules.Update, gamelossUpdateGroup)
      ;
  }, []);

  function addReactEventResources(engine: Engine) {
    engine.addResource("setScore", setScore);
    engine.addResource("setIsLoss", setIsLoss);
    engine.addSystem(Schedules.Update, {
      query: {
        resources: ["setScore", DefaultResources.Time, GameStateRes]
      },
      run(queryResult: QueryResult) {
        const setScore = queryResult.resources.getRW<Dispatch<SetStateAction<number>>>("setScore")!;
        const gameState = queryResult.resources.getRW<GameState>(GameStateRes)!;
        const time = queryResult.resources.get<Time>(DefaultResources.Time)!;

        setScore((score) => {
          return Math.floor(expDecay(score, gameState.score, 10, time.delta));
        });
      },
    })
      .addSystem(Schedules.Update, {
        query: {
          resources: [GameStateRes, "setIsLoss"],
        },
        run(queryResult: QueryResult) {
          const setIsLoss = queryResult.resources.getRW<Dispatch<SetStateAction<boolean>>>("setIsLoss")!;
          const gameState = queryResult.resources.getRW<GameState>(GameStateRes)!;
          setIsLoss(gameState.isLoss);
        },
      })
  }

  function restart() {
    engine.current.clearEntities();
    mainInitializationGroup.resetSystems!();
    const gameState = engine.current.getResource<GameState>(GameStateRes)!
    gameState.isLoss = false;
    gameState.score = 0;

    const popTimer = engine.current.getResource<Timer>(PopTimer)!;
    popTimer.time = 0;
    setScore(0);
    setIsLoss(false);
  }

  return (
    <div ref={getGameContainerRef} className="game-container">
      <div className="game-ui-container" onPointerDown={(evt) => evt.preventDefault()}>
        {isLoading ?
          (
            <>
              Loading
            </>
          ) :
          (
            <div>
              <div>Score: {score}</div>
              {isLoss && (
                <>
                  <button onClick={restart}>Play again</button>
                </>
              )}
            </div>
          )
        }
      </div>
      <canvas id={id} ref={getCanvasRef}></canvas>
    </div>
  );
}
