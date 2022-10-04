let baseURL = 'http://localhost:3000/api/';

const env = process.env['NODE_ENV'];
const url = process.env['VUE_APP_PROD_URL'];

if (env === 'production') {
    baseURL = url;
}

export default {
     createUser: (data: any, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "registration";
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

    updateUser: (user: any, userID: string, onResponse: any) => {
         const xhr = new XMLHttpRequest();
         const url = baseURL + "users/" + userID;
         xhr.open('PUT', url, true);
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
         xhr.send(JSON.stringify(user));
    },

    sendRatingToUser: (rating: any, userID: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "users/"+userID+"/rating"
        xhr.open('POST',url,true);
        xhr.setRequestHeader("Content-Type","application/json")
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    const token = JSON.parse(xhr.response).token;
                    localStorage.setItem("token", token);
                }
                onResponse(xhr.response);
            }
        }
        xhr.send(JSON.stringify(rating))
    },

    login: (data: any, onResponse: any) => {
            const xhr = new XMLHttpRequest();
            const url = baseURL + "login";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const token = JSON.parse(xhr.response).token;
                        localStorage.setItem("token", token);
                    }
                    onResponse(xhr.status);
                }
            }
            xhr.send(JSON.stringify(data));
        },

    checkLogin: () => {
        const loginData = getToken();
        return loginData;
    },

    logOut: () => {
         localStorage.removeItem('token');
    },

    getUserByID: (userID: string, onResponse: any) => {
        const xhr = new XMLHttpRequest();
        const url = baseURL + "users/" + userID;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                onResponse(JSON.parse(xhr.responseText), xhr.status);
            }
        }
        xhr.send();
    }

};

export function parse(token: string) {
    let info = null
    try {
        info = decodeURIComponent(
        Array.prototype.map
            .call(
                atob(token),
                (znak: string) => {
                    return '%' + ('00' + znak.charCodeAt(0).toString(16)).slice(-2);
                }
            )
            .join('')
    )} catch(e) {
        console.log(e)
    }
    return info
}

export function getToken() : any {
   let info = parse(localStorage.token.split('.')[1]);
   if (info != null) {
       info = JSON.parse(info)
   }
   return info
}


