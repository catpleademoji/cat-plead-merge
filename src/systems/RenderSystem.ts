import { Resource } from "../engine/Query";
import QueryResult from "../engine/QueryResult";
import System from "../engine/System";
import { SpriteId } from "../components/SpriteId";
import { Position } from "../components/Position";

export default class RenderSystem implements System {
    query = [
        new Resource("canvasContext"),
        new Resource("time"),
        new Resource("sprites"),
        SpriteId,
        Position,
    ];
    execute(query: QueryResult) {
        const ctx = query.getResource("canvasContext") as CanvasRenderingContext2D;
        const time = query.getResource("time");

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        query.entities.forEach(entity => {
            const spriteId = entity.getComponent(SpriteId) as SpriteId;
            const position = entity.getComponent(Position) as Position;

            ctx.save();

            ctx.fillText(spriteId.id.toString(), position.x, position.y);

            ctx.restore();
        });

        ctx.fillText((1 / time.deltaTime).toFixed(2), 10, 10);
    }
}
