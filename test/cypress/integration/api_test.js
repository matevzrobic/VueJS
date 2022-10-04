function parse(token) {
    let info = null
    try {
        info = decodeURIComponent(
            Array.prototype.map
                .call(
                    atob(token),
                    (znak) => {
                        return '%' + ('00' + znak.charCodeAt(0).toString(16)).slice(-2);
                    }
                )
                .join('')
        )} catch(e) {
        console.log(e)
    }
    return info
}

let id = null;
let dogId = null
let ad1 = null
let rep1 = null
let message1 = null

describe("API testing", () => {
    context("User database API:", () => {
        it("Clears database of users" ,() => {
            cy.request({
                method: "DELETE",
                url: "http://localhost:3000/api/users",
            }).then((res) => {
                expect(res.body).to.be.empty;
            })
        })

        it("Registers a user" ,() => {
            cy.request({
                method: "POST",
                url: "http://localhost:3000/api/registration",
                body: {
                    "email": "email@email.com",
                    "name": "ime",
                    "surname": "priimek",
                    "password": "geslo",
                    "enabled": true,
                    "role": "owner"
                }
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })

        it("Tries to register the same user again" ,() => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/registration",
                body: {
                    "email": "email@email.com",
                    "name": "ime",
                    "surname": "priimek",
                    "password": "geslo"
                }
            }).then((res) => {
                expect(res.status).to.equal(409);
                expect(res.body.message).to.equal("This email is already used for another account");
            })
        })

        it("Logs in the user with the registered password and email", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/login",
                body: {
                    "email": "email@email.com",
                    "password": "geslo"
                }
            }).then((res) => {
                let token = res.body.token.split(".")[1];
                id = JSON.parse(parse(token))._id
                expect(res.status).to.equal(200);
            })
        })
        it("Tries to log in the user with the wrong password", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/login",
                body: {
                    "email": "email@email.com",
                    "password": "geslo3"
                }
            }).then((res) => {
                expect(res.status).to.equal(401);
                expect(res.body.message).to.equal("Wrong password");
            })
        })
        it("Tries to log in the user with the wrong email", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/login",
                body: {
                    "email": "email@gmail.com",
                    "password": "geslo"
                }
            }).then((res) => {
                //expect(res.status).to.equal(400);
                expect(res.body.message).to.equal("Wrong email");
            })
        })
        it("Change user's name, surname and password", () => {
            cy.request({
                method: "PUT",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/users/" + id,
                body: {
                    "email": "email@email.com",
                    "password": "password",
                    "name": "new name",
                    "surname": "new surname"
                }
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Try logging in with new password", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/login",
                body: {
                    "email": "email@email.com",
                    "password": "password",
                }
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Disable user", () => {
            cy.request({
                method: "PUT",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/users/" + id,
                body: {
                    "enabled": "false",
                }
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Try logging in user when disabled", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/login",
                body: {
                    "email": "email@email.com",
                    "password": "password",
                }
            }).then((res) => {
                expect(res.status).to.equal(401);
            })
        })
        it("Enable user", () => {
            cy.request({
                method: "PUT",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/users/" + id,
                body: {
                    "enabled": "true",
                }
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Add rating to user", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/users/" + id + "/rating",
                body: {
                    "author_name": "author1",
                    "rating": 4,
                    "comment": "i give rating 4",
                }
            }).then((res) => {
                expect(res.status).to.equal(201);
            })
        })
        it("Check if user has rating", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/users/" + id,
                body: {}
            }).then((res) => {
                expect(res.body.ratings_list[0].comment).to.equal("i give rating 4");
            })
        })
        it("Add another rating to user", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/users/" + id + "/rating",
                body: {
                    "author_name": "author2",
                    "rating": 2,
                    "comment": "i give rating 2",
                }
            }).then((res) => {
                expect(res.status).to.equal(201);
            })
        })
        it("Check if user has average rating score adjusted", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/users/" + id,
                body: {}
            }).then((res) => {
                expect(res.body.average_rating).to.equal(3);
            })
        })
    })

    context("Dog database API:", () => {
        it("Adds a new dog to user", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dogs",
                body: {
                    "owner_id": id,
                    "name": "dog1",
                    "age": 2,
                    "breed": "Schnauzer",
                    "picture_id": "",
                }
            }).then((res) => {
                expect(res.status).to.equal(201);
                dogId = res.body._id;
            })
        })
        it("Adds another dog to user", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dogs",
                body: {
                    "owner_id": id,
                    "name": "dog2",
                    "age": 2,
                    "breed": "Schnauzer",
                    "picture_id": "",
                }
            }).then((res) => {
                expect(res.status).to.equal(201);
            })
        })
        it("Checks if all dogs were inserted in full database", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dogs",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(2);
            })
        })
        it("Checks if all dogs were inserted under user", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dogs/user/" + id,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(2);
            })
        })
        it("Checks if dog is accessible by its id", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dogs/id/" + dogId,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal("dog1");
            })
        })
        it("Checks api returns dog breeds list", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dogs/breeds",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(201);
            })
        })
    })

    context("Ad database API:", () => {
        it("Creates new ad", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/ads",
                body: {
                    "author_id": id,
                    "title": "title1",
                    "description": "desc1",
                    "dateNeeded": "2021-05-25T15:00:00.000Z",
                    "location": "stajerska",
                    "dog_ids": [dogId],
                }
            }).then((res) => {
                ad1 = res.body
                expect(res.status).to.equal(201);
            })
        })
        it("Checks if ad was inserted under all ads", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/ads",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(1);
            })
        })
        it("Checks if ad was inserted under user", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/ads/user/" + id,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(1);
            })
        })
        it("Updates ad", () => {
            cy.request({
                method: "PUT",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/ads/" + ad1._id,
                body: {
                    "title": "title2",
                    "description": ad1.description,
                    "dateNeeded": ad1.dateNeeded,
                    "location": ad1.location,
                    "dog_ids": ad1.dog_ids,
                    "active": ad1.active,
                    "isDone": ad1.isDone,
                }
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Checks if ad was updated under user", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/ads/user/" + id,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body[0].title).to.equal("title2");
            })
        })
        it("Gets ad by id", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/ads/id/" + ad1._id,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.title).to.equal("title2");
            })
        })
    })

    context("Report database API:", () => {
        it("Creates new report", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/reports",
                body: {
                    "reported_account_id": "1",
                    "reported_by_id": id,
                    "reason": "i just felt like it",
                    "date": Date.now()
                }
            }).then((res) => {
                rep1 = res.body._id;
                expect(res.status).to.equal(201);
            })
        })
        it("Gets report by id", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/reports/" +rep1,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.reason).to.equal("i just felt like it");
            })
        })
        it("Gets all reports", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/reports/",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.length).to.equal(1);
            })
        })
    })

    context("Message database API:", () => {
        it("Creates new message for recipient", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/messages",
                body: {
                    "sender_id": "1",
                    "recipient_id": id,
                    "ad_id": ad1,
                    "text": "writing you for ad 1",
                }
            }).then((res) => {
                message1 = res.body._id;
                expect(res.status).to.equal(201);
            })
        })
        it("Creates new message as sent", () => {
            cy.request({
                method: "POST",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/messages",
                body: {
                    "sender_id": id,
                    "recipient_id": "1",
                    "ad_id": ad1,
                    "text": "replying you for ad 1",
                }
            }).then((res) => {
                expect(res.status).to.equal(201);
            })
        })
        it("Gets message by id", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/messages/id/" + message1,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.text).to.equal("writing you for ad 1");
            })
        })
        it("Gets all received messages", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/messages/received/" + id,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body[0].text).to.equal("writing you for ad 1");
            })
        })

        it("Gets all sent messages", () => {
            cy.request({
                method: "GET",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/messages/sent/" + id,
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body[0].text).to.equal("replying you for ad 1");
            })
        })
    })

    context("Clear all databases", () => {
        it("Clears ad database", () => {
            cy.request({
                method: "DELETE",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dev/ads",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Clears dog database", () => {
            cy.request({
                method: "DELETE",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dev/dogs",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Clears message database", () => {
            cy.request({
                method: "DELETE",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dev/messages",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Clears report database", () => {
            cy.request({
                method: "DELETE",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dev/reports",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Clears rating database", () => {
            cy.request({
                method: "DELETE",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dev/ratings",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
        it("Clears user database", () => {
            cy.request({
                method: "DELETE",
                failOnStatusCode: false,
                url: "http://localhost:3000/api/dev/users",
                body: {}
            }).then((res) => {
                expect(res.status).to.equal(200);
            })
        })
    })
})