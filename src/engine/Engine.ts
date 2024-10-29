import Resource from "./Resource";
import System from "./System";
import { Resource as ResourceQuery } from "./Query";
import QueryResult from "./QueryResult";
import Archetype from "./Archetype";
import EntityManager from "./EntityManager";

class Engine {
  private resources: Map<string, any>;
  private systems: System[];
  private queryResults: WeakMap<System, QueryResult>;
  private entityManager: EntityManager;

  constructor() {
    this._update = this._update.bind(this);
    this.resources = new Map<string, any>();
    this.systems = [];
    this.queryResults = new Map<System, QueryResult>();
    this.entityManager = new EntityManager();

    this.resources.set("time", {
      startTime: 0,
      deltaTime: 0,
      totalTime: 0,
      currentTime: 0,
    });
  }

  run() {
    this.systems.forEach(system => {
      const resources = system.query
        .filter(query => query instanceof ResourceQuery)
        .map(resourceQuery => {
          return { name: resourceQuery.name, value: this.resources.get(resourceQuery.name) };
        });

      const archetypes = this.entityManager.queryArchetypes(system.query)
      const queryResult = new QueryResult(archetypes, resources);
      this.queryResults.set(system, queryResult);
    });

    window.requestAnimationFrame(this._update);
  }

  private _update(timestamp: DOMHighResTimeStamp) {
    const time = this.resources.get("time");

    const frameTime_ms = timestamp - time.currentTime;
    time.currentTime = timestamp;
    time.totalTime += frameTime_ms;

    const frameTime_s = frameTime_ms / 1000;
    const fps = 1 / frameTime_s;
    time.deltaTime = frameTime_s;

    if (frameTime_s > 1) {
      console.warn("frame time was really long", frameTime_s, fps);
    }

    this.systems.forEach(system => {
      system.execute(this.queryResults.get(system)!);
    })

    window.requestAnimationFrame(this._update);
  }

  addSystem(system: System): Engine {
    this.systems.push(system);
    return this;
  }

  addResource(resource: Resource) {
    this.resources.set(resource.name, resource.value);
    return this;
  }

  createEntities(generator: (entityManager: EntityManager) => void) {
    generator(this.entityManager);
    return this;
  }

}

export default Engine;
