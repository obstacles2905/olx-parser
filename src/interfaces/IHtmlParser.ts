import {IOfferDetails} from "./IOfferDetails";

export abstract class IHtmlParser {
    abstract getOffersDetails(html: any): IOfferDetails[];
    abstract getOfferDetailsFromHtml(html: any): IOfferDetails;
    abstract getOffersTableBody(html: any): any;
    abstract getOfferDetails(tableTbody: any): IOfferDetails;
    abstract getOfferName(offerImageAndLinkTd: any): string;
    abstract getOfferLink(offerImageAndLinkTd: any): string;
    abstract getOfferImageLink(offerImageAndLinkTd: any): string;
    abstract getOfferPrice(offerTopPartTr: any): string;
    abstract getOfferAddress(offerBottomPartTr: any): string;
    abstract getOfferTimestamp(offerBottomPartTr: any): string;
}