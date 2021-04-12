import * as htmlParser from "node-html-parser";
import {IOfferDetails} from "../interfaces/IOfferDetails";
import {IHtmlParser} from "../interfaces/IHtmlParser";

const FIRST_OFFER_INDEX = 2;
const ADS_BLOCKS_AMOUNT = 2;

export class HtmlParser extends IHtmlParser {
    getOffersDetails(html: any): IOfferDetails[] {
        const offersTableBody = this.getOffersTableBody(html);
        const offersTableBodyWithoutAdsBlocks = offersTableBody.childNodes.slice(FIRST_OFFER_INDEX, offersTableBody.childNodes.length - ADS_BLOCKS_AMOUNT);

        return offersTableBodyWithoutAdsBlocks.flatMap((offerTableBody: any, index: number) => {
            if (index % 2 !== 0) {
                return this.getOfferDetailsFromHtml(offerTableBody) ;
            }
            return [];
        })
    }

    getOffersTableBody(html: any): any {
        const offersTable = htmlParser.parse(html)
            .querySelectorAll("#offers_table")[0];
        return offersTable.childNodes[1];
    }

    getOfferDetailsFromHtml(offerTr: any): IOfferDetails {
        const offerWrapper = offerTr.childNodes[1].childNodes[1];
        const offerTableTbody = offerWrapper.childNodes[1].childNodes[1];

        return this.getOfferDetails(offerTableTbody);
    }

    getOfferDetails(tableTbody: any): IOfferDetails {
        const offerTopPartTr = tableTbody.childNodes[1].childNodes;
        const offerBottomPartTr = tableTbody.childNodes[3].childNodes;

        const offerImageAndLinkTd = offerTopPartTr[1].childNodes;

        const offerName = this.getOfferName(offerImageAndLinkTd);
        const offerLink = this.getOfferLink(offerImageAndLinkTd);
        const offerImageLink = this.getOfferImageLink(offerImageAndLinkTd);
        const offerPrice = this.getOfferPrice(offerTopPartTr);
        const offerAddress = this.getOfferAddress(offerBottomPartTr);
        const offerTimestamp = this.getOfferTimestamp(offerBottomPartTr);

        return {name: offerName, link: offerLink, imageLink: offerImageLink, price: offerPrice, address: offerAddress, timestamp: offerTimestamp};
    }

    getOfferName(offerImageAndLinkTd: any): string {
        return offerImageAndLinkTd[1].childNodes[1]["_attrs"].alt;
    }

    getOfferLink(offerImageAndLinkTd: any): string {
        return offerImageAndLinkTd[1]["_attrs"].href;
    }

    getOfferImageLink(offerImageAndLinkTd: any): string {
        return offerImageAndLinkTd[1].childNodes[1]["_attrs"].src;
    }

    getOfferPrice(offerTopPartTr: any): string {
        const offerPriceTd = offerTopPartTr[5];
        const offerPriceDiv = offerPriceTd.childNodes[1];
        const offerPriceP = offerPriceDiv.childNodes[1];
        return offerPriceP.childNodes[1].childNodes[0].rawText;
    }

    getOfferAddress(offerBottomPartTr: any): string {
        return offerBottomPartTr[1]
            .childNodes[1]
            .childNodes[1]
            .childNodes[1]
            .childNodes[1]
            .childNodes[1]
            .rawText;
    }

    getOfferTimestamp(offerBottomPartTr: any): string {
        return offerBottomPartTr[1]
            .childNodes[1]
            .childNodes[1]
            .childNodes[3]
            .childNodes[1]
            .childNodes[1]
            .rawText;
    }
}