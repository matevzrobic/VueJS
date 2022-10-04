let baseURL = 'http://localhost:3000/api/';

const env = process.env['NODE_ENV'];
const url = process.env['VUE_APP_PROD_URL'];

if (env === 'production') {
    baseURL = url;
}

export default {
    createMessage: (data: any, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "messages";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    const token = JSON.parse(xhr.response).token;
                    localStorage.setItem("token", token);
                }
                onResponse(xhr.status);
            }
        }
        xhr.send(JSON.stringify(data));
    },
    getMessageById: (messageId: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "messages/id/" + messageId;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText), xhr.status);
            }
        }
        xhr.send();
    },
    getSentMessages: (receiverId: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "messages/sent/" + receiverId;
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    },
    getReceivedMessages: (receiverId: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "messages/received/" + receiverId;
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    }
}