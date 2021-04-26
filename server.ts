import express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import {router} from "./src/routes/index";

import {logger} from "./src/logger";
import {Scheduler} from "./src/components/scheduler";
dotenv.config();

const port = process.env.APPLICATION_PORT;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);

const server = app.listen(port, () => {
    logger.info(`Server is running on ${port}`)
});

const disableJobParam = '--disable-job-scheduling';
const jobSchedulingDisabled = process.argv && process.argv[2] === disableJobParam;
if (jobSchedulingDisabled) {
    logger.info(`Job scheduling disabled with ${disableJobParam} parameter.`);
} else {
    (async function(): Promise<void> {
        const scheduler = new Scheduler();

        scheduler.start();
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