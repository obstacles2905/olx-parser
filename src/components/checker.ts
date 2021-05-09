import {DataProvider} from "./dataProvider";
import {IHtmlParser} from "../interfaces/IHtmlParser";
import {RedisClient} from "redis";
import {IOfferDetails} from "../interfaces/IOfferDetails";
import {isOffersArraysEqual} from "../utils/utils";
import {logger} from "../logger";

export class Checker {
    constructor(
        private dataProvider: DataProvider,
        private htmlParser: IHtmlParser,
        private redisClient: RedisClient
    ) {}

    async performSingleCheck(url: string): Promise<IOfferDetails[]> {
        const rawHtml = await this.dataProvider.fetchRawHtml(url);

        const offers = this.htmlParser.getOffersDetails(rawHtml);
        const offersFromRedis = await this.fetchOffersFromRedis(url);

        const isEqual = isOffersArraysEqual(offers, offersFromRedis);
        if (!isEqual) {
            logger.info(offers);
            this.redisClient.setex(url, 3600, JSON.stringify(offers));
            return offers;
        }

        logger.info('No new offers are found');
        return [];
    }

    async fetchOffers(url: string): Promise<IOfferDetails[]> {
        const offersFromRedis = await this.fetchOffersFromRedis(url);

        if (offersFromRedis.length !== 0) {
            logger.info('Fetched from Redis', offersFromRedis);
            return offersFromRedis;
        }

        const rawHtml = await this.dataProvider.fetchRawHtml(url);

        const offersFromQuery = await this.htmlParser.getOffersDetails(rawHtml);
        logger.info(`Fetched from query ${url} `, offersFromQuery);

        return offersFromQuery;
    }

    async fetchOffersFromRedis(url: string): Promise<IOfferDetails[]> {
        return new Promise((resolve, reject) =>
            this.redisClient.get(url, (err, data) => {
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
    }
}