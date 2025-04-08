export class EventQueue<T> {
    items: T[];

    constructor() {
        this.items = [];
    }

    enqueue(event: T) {
        this.items.push(event);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    clear() {
        this.items = [];
    }

    get count() {
        return this.items.length;
    }

    /**
     * Apples the callback on each event in the queue, without removing it from the queue.
     * @param func 
     */
    foreach(func: (event: T) => void) {
        this.items.forEach(func);
    }
}
