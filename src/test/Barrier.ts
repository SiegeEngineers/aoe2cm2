export class Barrier {
    private readonly barrier: number;
    private called: number = 0;
    private readonly done: (value: void | PromiseLike<void>) => void;

    constructor(barrier: number, done: (value: void | PromiseLike<void>) => void) {
        this.barrier = barrier;
        this.done = done;
    }

    public trigger: () => void = () => {
        this.called++;
        console.log(`Barrier was triggered, is now at ${this.called} / ${this.barrier}`);
        if (this.called >= this.barrier) {
            console.log(`Calling done()`);
            this.done();
        }
    }
}