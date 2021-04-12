import express, {Request, Response} from "express";
import {DataProvider} from "../components/dataProvider";
import {HtmlParser} from "../components/parser";

export const router = express.Router();

router.get("/", async (request: Request, response: Response, next) => {
    const dataProvider = new DataProvider();
    const rawHtml = await dataProvider.fetchRawHtml();

    const parser = new HtmlParser();
    const offerDetails = parser.getOffersDetails(rawHtml);

    response.status(201).send(offerDetails);
});