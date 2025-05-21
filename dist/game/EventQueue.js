export class EventQueue {
    constructor() {
        this.items = [];
    }
    enqueue(event) {
        this.items.push(event);
    }
    dequeue() {
        return this.items.shift();
    }
    peek() {
        return this.items[0];
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
    foreach(func) {
        this.items.forEach(func);
    }
}
