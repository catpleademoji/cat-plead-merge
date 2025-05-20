export declare class EventQueue<T> {
    items: T[];
    constructor();
    enqueue(event: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    clear(): void;
    get count(): number;
    /**
     * Apples the callback on each event in the queue, without removing it from the queue.
     * @param func
     */
    foreach(func: (event: T) => void): void;
}
