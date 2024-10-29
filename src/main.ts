import Engine from "./engine/Engine";
import EntityManager from "./engine/EntityManager";
import { Resource } from "./engine/Query";
import QueryResult from "./engine/QueryResult";
import { Position } from "./components/Position";
import { Rotation } from "./components/Rotation";
import { Velocity } from "./components/Velocity";
import RenderSystem from "./systems/RenderSystem";
import "./style.css";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

new Engine()
    .addSystem(new RenderSystem())
    .addResource({ name: "canvasContext", value: context })
    .createEntities((entityManager: EntityManager) => {
        entityManager.createEntity([
            [Position, new Position()],
            [Velocity, new Velocity()]
        ]);
    })
    .run();

function HSVtoRGB(h: number, s: number, v: number) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r! * 255),
        g: Math.round(g! * 255),
        b: Math.round(b! * 255)
    };
}

const length = 1000;
const archetype = ["position", "velocity", "color"]
    .reduce((archetype: { [key: string]: any[] }, component) => {
        switch (component) {
            case "position":
            case "velocity":
                archetype[component] = Array.from({ length: length }, (_, i) => {
                    const x = Math.random() * 10;
                    const y = Math.random() * 10;
                    return { x, y };
                });
                break;
            case "color":
                archetype[component] = Array.from({ length: length }, (_, i) => {
                    const { r, g, b } = HSVtoRGB(Math.random() * 360, 1, 1)
                    return "#" + ((r << 16) + (g << 8) + b).toString(16);
                });
                break;
            default:
                break;
        }
        return archetype;
    }, {});

let prevTime = 0;
function update(timestamp: DOMHighResTimeStamp) {
    const deltaTime_ms = timestamp - prevTime;
    const deltaTime = deltaTime_ms / 1000;
    prevTime = timestamp;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const velocities = archetype["velocity"];
    const positions = archetype["position"];
    const colors = archetype["color"];

    for (let i = 0; i < length; i++) {
        context.save();

        const position = positions[i] as { x: number, y: number };
        const velocity = velocities[i] as { x: number, y: number };
        const color = colors[i] as string;

        position.x += velocity.x * deltaTime;
        position.y += velocity.y * deltaTime;

        if (position.x < 0) {
            position.x = context.canvas.width;
        }

        if (position.x > context.canvas.width) {
            position.x = 0;
        }

        if (position.y < 0) {
            position.y = context.canvas.height;
        }

        if (position.y > context.canvas.height) {
            position.y = 0;
        }

        positions[i] = position;

        context.fillStyle = color;
        context.fillRect(position.x, position.y, 2, 2);

        context.restore();
    }

    context.fillText((1 / deltaTime).toFixed(2), 10, 10);

    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
