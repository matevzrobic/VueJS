let baseURL = "http://localhost:3000/api/"

const env = process.env["NODE_ENV"]
const url = process.env['VUE_APP_PROD_URL'];

if(env === "production") {
    baseURL = url
}

export default {
    createAd: (data: any, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "ads";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(xhr.status);
            }
        }
        xhr.send(JSON.stringify(data));
    },

    getUserAds: (userID: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "ads/user/" + userID;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    },

    deleteAd: (adID: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "ads/" + adID;
        xhr.open("DELETE", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                onResponse(xhr.status);
            }
        }
        xhr.send();
    },

    updateAd: (adID: string, ad: any, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "ads/" +adID;
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                onResponse(xhr.status, JSON.parse(xhr.responseText));
            }
        }
        xhr.send(JSON.stringify(ad));
    }
}