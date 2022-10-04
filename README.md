# Lastni projekt pri predmetu TPO

Vsaka skupina, ki je sestavljena iz 4 oz. 5 članov, mora razviti lastni projekt (LP) na izbrani problemski domeni, in sicer od **predloga projekta** do **implementacije**, kjer je podrobna razdelitev naslednja:

* **1. LP** - [Predlog projekta](docs/predlog-projekta),
* **2. LP** - [Zajem zahtev](docs/zajem-zahtev),
* **3. LP** - [Načrt rešitve](docs/nacrt) in
* **4. LP** - [Implementacija](src).

# Aplikacija
- https://tpo-dog-walker.herokuapp.com/

# Navodila za namestitev
Assuming you have docker installed:
- `git clone https://github.com/tpo-2020-2021/LP234-22.git`
- `cd src/backend`
- `npm install`
- Windows: `docker compose up`, Linux: `sudo docker-compose up`
- open new terminal in project root
- `cd src/backend`  
- `npm run serve`
- in new terminal in src/backend: `npm run init-user` to get the main user accounts registered 
- open new terminal in project root
- `cd src/frontend`
- `npm install`
- `npm run serve`
- in browser open `http://localhost:8080/`

# Uporabniki

## Admin
- email: admin@admin.com
- password: admin

## Moderator
- email: moderator@moderator.com
- password: moderator

## Sprehajalec
- email: walker@walker.com
- password: walker

## Lastnik
- email: owner@owner.com
- password: owner

[![Continuous Integration](https://github.com/tpo-2020-2021/LP234-22/actions/workflows/CI.yml/badge.svg?branch=test)](https://github.com/tpo-2020-2021/LP234-22/actions/workflows/CI.yml)

[![Continuous Deployment](https://github.com/tpo-2020-2021/LP234-22/actions/workflows/CD.yml/badge.svg?branch=production)](https://github.com/tpo-2020-2021/LP234-22/actions/workflows/CD.yml)
