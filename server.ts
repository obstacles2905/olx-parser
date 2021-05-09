import express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import {router} from "./src/routes/index";
import cors from "cors";

import {logger} from "./src/logger";
import {Scheduler} from "./src/components/scheduler";
import {IShutdownWork} from "./src/interfaces/IScheduler";
dotenv.config();

const port = process.env.APPLICATION_PORT;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", router);

const shutdownWork: IShutdownWork[] = [];

const server = app.listen(port, async () => {
    logger.info(`Server is running on ${port}`);

    // logger.info(`Shutting down running scheduler...`);
    // for (const work of shutdownWork) {
    //     logger.info(work.title);
    //     await work.shutdown();
    // }
    // logger.info(`Shutting down running scheduler...done`);
});

const disableJobParam = '--disable-job-scheduling';
const jobSchedulingDisabled = process.argv && process.argv[2] === disableJobParam;
if (jobSchedulingDisabled) {
    logger.info(`Job scheduling disabled with ${disableJobParam} parameter.`);
} else {
    (async function(): Promise<void> {
        // const scheduler = new Scheduler();
        // shutdownWork.push({
        //     title: 'Stopping any ongoing unit-of-work',
        //     shutdown: () => scheduler.terminate('SAM Historian importer process going down.'),
        // });

        // scheduler.start();
    })();
}

const sigs = ["SIGINT", "SIGTERM", "SIGQUIT"];
sigs.forEach((sig) => {
    process.on(sig, () => {
        logger.info(`${sig} called, shutdown application`);
        server.close(() => {
            process.exit(0);
        });
    });
});