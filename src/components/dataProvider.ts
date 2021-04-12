import * as https from "https";

export class DataProvider {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    async fetchRawHtml() {
        return new Promise(((resolve, reject) => {
            https.get(this.url, {}, response => {
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