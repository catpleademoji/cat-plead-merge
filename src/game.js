import config from "./config.js";
import loadCats from "./Utils/loadCats.js";
import loadParticles from "./Utils/loadParticles.js";
import loadSoundEffects from "./Utils/loadSoundEffects.js";
import StepLifetime from "./Systems/StepLifetime.js";
import IntegrateMotion from "./Systems/IntegrateMotion.js";
import CollideBodies from "./Systems/CollideBodies.js";
import PhysicsWorld from "./Systems/PhysicsWorld.js";
import DrawCats from "./Systems/DrawCats.js";
import DrawParticles from "./Systems/DrawParticles.js";
import MergeCats from "./Systems/MergeCats.js";
// import DrawTimeUI from "./Systems/DrawTimeUI.js";
import DrawScoreUI from "./Systems/DrawScoreUI.js";
import ClearCanvas from "./Systems/ClearCanvas.js";
// import DebugPhysics from "./Systems/DebugPhysics.js";
import DestroyAtEndOfDuration from "./Systems/DestroyAtEndOfDuration.js";
import spawnParticles from "./Utils/spawnParticles.js";
import playPopSfx from "./Utils/playPopSfx.js";
import { SCREEN_TO_WORLD } from "./Utils/screen.js";
import SpawnNextCat from "./Systems/SpawnNextCat.js";
import DrawActiveCat from "./Systems/DrawActiveCat.js";
import DropActiveCat from "./Systems/DropActiveCat.js";
import ClearInputs from "./Systems/ClearInputs.js";
import DrawHeightLimitWarning from "./Systems/DrawHeightLimitWarning.js";
import GetHighestCat from "./Systems/GetHighestCat.js";
import SetLoss from "./Systems/SetLoss.js";
import SystemGroup from "./Core/SystemGroup.js";
import PopCats from "./Systems/PopCats.js";
import DrawLossScreenUI from "./Systems/DrawLossScreenUI.js";

export default function Game({
  backgroundCanvas,
  uiCanvas,
  gameCanvas,
  fxCanvas,
  engine,
}) {
  const state = {
    startTime: 0,
    totalTime: 0,
    currentTime: 0,
    deltaTime: 0,
    isRunning: false,
    isPaused: false,
    pausedTime: 0,
    width: config.width,
    height: config.height,
    scale: 1,
    score: 0,
    highest_cat: 0,
    cooldown: 1,
  }
  const resources = {};

  this.run = function() {
    if (state.isRunning) {
      return;
    }

    state.isRunning = true;
    requestAnimationFrame(update);
  };

  this.pause = function() {
    state.isRunning = false;
    state.isPaused = true;
  };

  const update = function(timestamp) {
    if (!state.isRunning) {
      return;
    }

    if (!state.startTime) {
      state.startTime = timestamp;
      state.currentTime = timestamp;
    }

    if (state.isPaused) {
      state.pausedTime += timestamp - state.currentTime;
      state.isPaused = false;
    }

    state.totalTime = timestamp - state.startTime - state.pausedTime;
    state.deltaTime = timestamp - state.currentTime;
    state.currentTime = timestamp;

    // const timestepms = 1000 / 60;
    // while (state.deltaTime > timestepms) {
    engine.update({
      deltaTime: 1 / 60,
      totalTime: state.totalTime / 1000,
      currentTime: state.currentTime / 1000,
    }, state, resources);
    //   state.deltaTime -= timestepms;
    // }

    requestAnimationFrame(update);
  };

  this.loadResources = async function() {
    resources.audioContext = new AudioContext();

    resources.cats = await loadCats();
    resources.particles = await loadParticles();
    resources.soundEffects = await loadSoundEffects(resources.audioContext);
    resources.backgroundCanvasContext = backgroundCanvas.getContext("2d");
    resources.gameCanvasContext = gameCanvas.getContext("2d");
    resources.uiCanvasContext = uiCanvas.getContext("2d");
    resources.fxCanvasContext = fxCanvas.getContext("2d");

    backgroundCanvas.width = config.width;
    backgroundCanvas.height = config.height;
    gameCanvas.width = config.width;
    gameCanvas.height = config.height;
    uiCanvas.width = config.width;
    uiCanvas.height = config.height;
    fxCanvas.width = config.width;
    fxCanvas.height = config.height;
  };

  this.addSystems = function() {
    const earlySystemGroup = new SystemGroup();
    earlySystemGroup.addSystem(new ClearCanvas());
    engine.addSystemGroup(earlySystemGroup);

    const mainSystemGroup = new SystemGroup((state) => !Boolean(state.loss));
    mainSystemGroup.addSystem(new StepLifetime());
    const physicsWorld = new PhysicsWorld({
      gravity: config.gravity,
      worldBounds: {
        minx: 0,
        miny: 0,
        maxx: config.width * SCREEN_TO_WORLD,
        maxy: config.height * SCREEN_TO_WORLD,
      }
    });
    mainSystemGroup.addSystem(new IntegrateMotion(physicsWorld));
    mainSystemGroup.addSystem(new CollideBodies(physicsWorld));
    mainSystemGroup.addSystem(new MergeCats(engine, function onMergeCats(cats) {
      cats.forEach((cat) => {
        spawnParticles(cat, resources.particles, engine);

        playPopSfx(resources.soundEffects, resources.audioContext);
      });

      state.score += cats.reduce((total, cat) => {
        return total + cat.score;
      }, 0);

      state.highest_cat = Math.max(state.highest_cat, ...cats.map(cat => cat.type));
    }));
    mainSystemGroup.addSystem(new SpawnNextCat());
    mainSystemGroup.addSystem(new DropActiveCat(engine));
    mainSystemGroup.addSystem(new GetHighestCat());
    mainSystemGroup.addSystem(new SetLoss());
    mainSystemGroup.addSystem(new DrawHeightLimitWarning());
    mainSystemGroup.addSystem(new DrawActiveCat());
    mainSystemGroup.addSystem(new DrawScoreUI());
    engine.addSystemGroup(mainSystemGroup);

    const gameOverSystemGroup = new SystemGroup((state) => Boolean(state.loss));
    gameOverSystemGroup.addSystem(new StepLifetime());
    gameOverSystemGroup.addSystem(new IntegrateMotion(physicsWorld));
    gameOverSystemGroup.addSystem(new CollideBodies(physicsWorld));
    gameOverSystemGroup.addSystem(new PopCats(engine));
    gameOverSystemGroup.addSystem(new DrawLossScreenUI());
    engine.addSystemGroup(gameOverSystemGroup);

    const lateSystemGroup = new SystemGroup();
    lateSystemGroup.addSystem(new DrawCats());
    // lateSystemGroup.addSystem(new DrawTimeUI());
    lateSystemGroup.addSystem(new DrawParticles());
    lateSystemGroup.addSystem(new DestroyAtEndOfDuration(engine));
    lateSystemGroup.addSystem(new ClearInputs());
    engine.addSystemGroup(lateSystemGroup);
  };

  // this.setScale = function(scale) {
  //   state.scale = Math.min(Math.max(scale, 0.75), 10);

  //   gameCanvas.width = state.width * state.scale;
  //   gameCanvas.height = state.height * state.scale;

  //   uiCanvas.width = state.width * state.scale;
  //   uiCanvas.height = state.height * state.scale;

  //   fxCanvas.width = state.width * state.scale;
  //   fxCanvas.height = state.height * state.scale;

  //   backgroundCanvas.width = state.width * state.scale;
  //   backgroundCanvas.height = state.height * state.scale;
  // };

  this.setState = function(key, value) {
    state[key] = value;
  }

  this.getState = function(key) {
    return state[key];
  }
}