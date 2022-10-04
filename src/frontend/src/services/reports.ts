let baseURL = 'http://localhost:3000/api/';

const env = process.env['NODE_ENV'];
const url = process.env['VUE_APP_PROD_URL'];

if (env === 'production') {
    baseURL = url;
}

export default {
    createReport: (data: any, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "reports";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(xhr.status, JSON.parse(xhr.responseText));
            }
        }
        xhr.send(JSON.stringify(data));
    },
    getReports: (onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "reports";
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(xhr.status, JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    }
}