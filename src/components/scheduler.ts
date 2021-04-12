import {logger} from "../logger";
import {CronJob} from "cron";
import {IScheduler} from "../interfaces/IScheduler";

//TODO move to config
const CRON_EXPRESSION = "* * * * * *";

let onTickRunning = false;
export class Scheduler extends IScheduler{
    private cronJob: CronJob;

    constructor() {
        super();

        const onTick = (): void => {
            if(!onTickRunning) {
                onTickRunning = true;
                this.schedule()
                    .then(() => {
                        logger?.info(`Done`);
                        onTickRunning = false;
                    })
                    .catch(err => {
                        logger?.exception(err);
                        onTickRunning = false;
                    })
            }
        };
        const onCompleted = undefined;
        const start = false;
        const timezone = '';
        const runOnInit = false;
        this.cronJob = new CronJob(CRON_EXPRESSION, onTick, onCompleted, start, timezone, this, runOnInit);
    }

    public async schedule() {
        //TODO use GET / endpoint
    }

    start() {
        this.cronJob.start();
    }
}