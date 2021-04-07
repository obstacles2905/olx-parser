import express, {Request, Response} from "express";
import {DataProvider} from "../components/dataProvider";

export const router = express.Router();

router.get("/", async (request: Request, response: Response, next) => {
    const dataProvider = new DataProvider();
    await dataProvider.fetchRawHtml();

    response.status(201).send("hello world");
});