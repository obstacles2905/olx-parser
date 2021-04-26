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

    async performSingleCheck(): Promise<IOfferDetails[]> {
        const url = "https://www.olx.ua/list/q-forza-horizon-4/?search%5Bfilter_float_price%3Afrom%5D=500";
        const rawHtml = await this.dataProvider.fetchRawHtml();

        const offersDetails: IOfferDetails[] = this.htmlParser.getOffersDetails(rawHtml);

        const offersDetailsFromRedis: IOfferDetails[] = await new Promise((resolve, reject) =>
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

        const isEqual = isOffersArraysEqual(offersDetails, offersDetailsFromRedis);
        if (!isEqual) {
            logger.info(offersDetails);
            this.redisClient.setex(url, 3600, JSON.stringify(offersDetails));
        }

        logger.info('No new offers are found');
        return offersDetails;
    }
}