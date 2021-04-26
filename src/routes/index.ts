import express, {Request, Response} from "express";
import {DataProvider} from "../components/dataProvider";
import {HtmlParser} from "../components/htmlParser";
import * as redis from "redis";
import {Checker} from "../components/checker";

export const router = express.Router();

const redisPort = Number(process.env.REDIS_PORT);
const redisClient = redis.createClient(redisPort);

router.get("/", async (request: Request, response: Response) => {
    const url = "https://www.olx.ua/list/q-forza-horizon-4/?search%5Bfilter_float_price%3Afrom%5D=500";
    const dataProvider = new DataProvider();
    const htmlParser = new HtmlParser();

    const checker = new Checker(dataProvider, htmlParser, redisClient);

    const offers = await checker.performInitializationQuery(url);
    response.status(201).send(offers);
});