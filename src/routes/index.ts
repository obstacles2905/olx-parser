import express, {Request, Response} from "express";
import {DataProvider} from "../components/dataProvider";
import {HtmlParser} from "../components/htmlParser";
import * as redis from "redis";
import {isOffersArraysEqual} from "../utils/utils";
import {IOfferDetails} from "../interfaces/IOfferDetails";

export const router = express.Router();

const redisPort = Number(process.env.REDIS_PORT);
const redisClient = redis.createClient(redisPort);

router.get("/", async (request: Request, response: Response) => {
    const url = "https://www.olx.ua/list/q-forza-horizon-4/?search%5Bfilter_float_price%3Afrom%5D=500";
    const dataProvider = new DataProvider(url);
    const rawHtml = await dataProvider.fetchRawHtml();

    const parser = new HtmlParser();
    const offersDetails: IOfferDetails[] = parser.getOffersDetails(rawHtml);

    const offersDetailsFromRedis: IOfferDetails[] = await new Promise((resolve, reject) =>
        redisClient.get(url, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            if (!data) {
                resolve([]);
            }

            if (data) {
                resolve(JSON.parse(data));
            }
        })
    );

    const isEqual = isOffersArraysEqual(offersDetails, offersDetailsFromRedis);
    if (!isEqual) {
        redisClient.setex(url, 3600, JSON.stringify(offersDetails));
    }

    response.status(201).send(offersDetails);
});