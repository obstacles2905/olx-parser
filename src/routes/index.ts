import express, {Request, Response} from "express";
import {DataProvider} from "../components/dataProvider";
import {HtmlParser} from "../components/htmlParser";
import * as redis from "redis";
import {Checker} from "../components/checker";

export const router = express.Router();

const redisPort = Number(process.env.REDIS_PORT);
const redisClient = redis.createClient(redisPort);

router.get("/", async (request: Request, response: Response) => {
    const queryParams = request.query;
    console.log("aaaaaaaaaaaaaaaaa")
    if (!queryParams.offer) {
        console.log("000000000000")
        response.status(201).send([]);
        return;
    }
    console.log("1111111111111111")
    const filters = 'search%5Bfilter_float_price%3Afrom%5D=500';

    const olxUrl = `https://www.olx.ua/list/q-${queryParams.offer}/?${filters}`;
    const dataProvider = new DataProvider();
    const htmlParser = new HtmlParser();

    const checker = new Checker(dataProvider, htmlParser, redisClient);

    const offers = await checker.fetchOffers(olxUrl);
    response.status(201).send(offers);
});