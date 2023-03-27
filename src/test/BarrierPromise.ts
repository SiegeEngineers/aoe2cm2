export class BarrierPromise<T> {
    private readonly barrier: number;
    private called: number = 0;
    private values: T[] = [];
    private resolve: (value: T[] | PromiseLike<T[]>) => void = (value) => {};
    private resolved = false;
    public readonly promise;

    constructor(barrier: number) {
        this.barrier = barrier;
        this.promise = new Promise<T[]>((_resolve, _reject) => {
            this.resolve = _resolve
        });
    }

    public trigger: (value?: T) => Promise<T[]> = (value?: T) => {
        this.called++;
        console.log(`BarrierPromise was triggered, is now at ${this.called} / ${this.barrier}`);
        if (!this.resolved && value !== undefined) {
            this.values.push(value);
        }
        if (this.called >= this.barrier) {
            console.log('BarrierPromise is done');
            this.resolved = true;
            this.resolve(this.values);
        }
        return this.promise;
    }
}