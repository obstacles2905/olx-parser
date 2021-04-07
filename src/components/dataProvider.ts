import * as https from "https";

export class DataProvider {
    async fetchRawHtml() {
        const url = "https://www.olx.ua/list/q-forza-horizon-4/";

        return new Promise(((resolve, reject) => {
            https.get(url, {}, response => {
                let htmlData: any = "";
                response.on("data", data => {
                    htmlData += data;
                });

                response.on("end", () => {
                    resolve(htmlData);
                });

                response.on("error", (err) => {
                    reject(err);
                })
            });
        }))
    }
}