import * as htmlParser from "node-html-parser";

export class HtmlParser {
    parseRawHtml(html: any) {
        const offersTable = htmlParser.parse(html)
            .querySelectorAll("#offers_table")[0];
        const tableBody = offersTable.childNodes[1];

        const offerWrapper = tableBody.childNodes[3].childNodes[1].childNodes[1];
        const offerTableTbody = offerWrapper.childNodes[1].childNodes[1];

        const offerTopPartTr = offerTableTbody.childNodes[1].childNodes;
        // const offerBottomPartTr = offerTableTbody.childNodes[3].childNodes;

        const offerImageAndLinkTd = offerTopPartTr[1].childNodes;

        // @ts-ignore
        const offerName = offerImageAndLinkTd[1].childNodes[1]["_attrs"].alt;
        // @ts-ignore
        const offerLink = offerImageAndLinkTd[1]["_attrs"].href;
        // @ts-ignore
        const offerImageLink = offerImageAndLinkTd[1].childNodes[1]["_attrs"].src;

        const offerNameTd = offerTopPartTr[3];
        const offerPriceTd = offerTopPartTr[5];
    }
}