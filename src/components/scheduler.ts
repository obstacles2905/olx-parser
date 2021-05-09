import {logger} from "../logger";
import {CronJob} from "cron";
import {IScheduler} from "../interfaces/IScheduler";
import {DataProvider} from "./dataProvider";
import {HtmlParser} from "./htmlParser";
import {Checker} from "./checker";
import * as redis from "redis";
import cronstrue from "cronstrue";

//TODO move to config
const CRON_EXPRESSION = "0 */30 * * * *";

let onTickRunning = false;

const redisPort = Number(process.env.REDIS_PORT);
const redisClient = redis.createClient(redisPort);

export class Scheduler extends IScheduler {
    private cronJob: CronJob;

    constructor() {
        super();

        const onTick = (): void => {
            if(!onTickRunning) {
                onTickRunning = true;
                this.schedule()
                    .then(() => {
                        logger.info(`Done`);
                        onTickRunning = false;
                    })
                    .catch(err => {
                        logger.info(err);
                        onTickRunning = false;
                    })
            }
        };
        const onCompleted = undefined;
        const start = false;
        const timezone = '';
        const runOnInit = false;
        this.cronJob = new CronJob(CRON_EXPRESSION, onTick, onCompleted, start, timezone, this, runOnInit);
        logger.info(`Data's being synchronized ${cronstrue.toString(CRON_EXPRESSION)}`);
    }

    public async schedule() {
        const url = "https://www.olx.ua/list/q-forza-horizon-4/?search%5Bfilter_float_price%3Afrom%5D=500";
        const dataProvider = new DataProvider();
        const htmlParser = new HtmlParser();

        const checker = new Checker(dataProvider, htmlParser, redisClient);
        return checker.performSingleCheck(url);
    }

    start() {
        this.cronJob.start();
    }

    async terminate(reason: string): Promise<void> {
        this.cronJob.stop();
    }
}