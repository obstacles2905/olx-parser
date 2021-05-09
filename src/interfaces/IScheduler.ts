
export abstract class IScheduler {
    abstract schedule(): void;
    abstract start(): void;
}

export interface IShutdownWork {
    title: string;
    shutdown(): void | Promise<void>;
}
