let baseURL = "http://localhost:3000/api/"

const env = process.env["NODE_ENV"]
const url = process.env["VUE_APP_PROD_URL"];

if(env === "production") {
    baseURL = url
}

export default {
    createDog: (data: any, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "dogs";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(xhr.status, JSON.parse(xhr.responseText));
            }
        }
        xhr.send(JSON.stringify(data));
    },

    getUserDogs: (userID: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "dogs/user/" + userID;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    },

    getDogs: (onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "dogs/";
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText), xhr.status);
            }
        }
        xhr.send();
    },
    getBreeds: (onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "dogs/breeds";
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                console.log(xhr.responseText)
                onResponse(JSON.parse(xhr.responseText), xhr.status);
            }
        }
        xhr.send();
    },
    getDogByID: (dogID: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "dogs/id/" + dogID;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText), xhr.status);
            }
        }
        xhr.send();
    }
}