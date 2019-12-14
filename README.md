# Take-Away-AS-Frontend
[![pipeline status](https://gitlab.com/Sam1224/take-away-as-test/badges/master/pipeline.svg)](https://gitlab.com/Sam1224/take-away-as-test/commits/master)
[![coverage report](https://gitlab.com/Sam1224/take-away-as-test/badges/master/coverage.svg)](https://gitlab.com/Sam1224/take-away-as-test/badges/master/coverage.svg?job=coverage)

> Frontend of Take-Away App for the assignment of Web Application Development 2.

## Basic Information
- ID: 20086454
- Name: Qianxiong Xu

## Environment
- OS: Windows 10
- Node: v10.16.3

## Usage
- Clone:
```
git clone https://github.com/Sam1224/Take-Away-AS-Frontend.git
```
- Configure:
```
cd <your_dir>
npm install
```
- Run:
```
npm run start
```
- Test(Cypress):
```
npm run cypress:open
```

## Description of Functionality
- Client:
  >The client can be divided into 2 parts: `UI for frontend`and `UI for backend`.
  - Urls:
    - [Github](https://github.com/Sam1224/Take-Away-AS-Frontend)
    - [Gitlab(with CI/CD)](https://gitlab.com/Sam1224/take-away-as-frontend-test)
  - Functions:
    >This section only shows a brief description of functionalities of the client, a more detailed description with screenshots can be seen in [Gitlab(with CI/CD)](https://gitlab.com/Sam1224/take-away-as-frontend-test).
    - UI for frontend:
      - Login:
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/login
        - Function:
          - Allows users to login.
      - Register
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/register
        - Function:
          - Allows users to register.
      - Seller list
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/
        - Function:
          - Shows a seller list to users, allows users to select seller items.
          - Allows users to do fuzzy search.
      - Goods page of a seller
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/
          - Click: Any seller.
        - Function:
          - Shows a list of goods.
          - Shows a mask of basic information.
          - Shows a shopcart.
          - Allows users to select food to see its details.
      - Ratings page of a seller
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/
          - Click: Any seller.
          - Click: Ratings on the navigation bar in a seller page.
        - Function:
          - Allows users to see the scores and ratings of a seller, filter to see good/bad ratings and switch to see ratings without contents.
      - Seller infomation page of a seller
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/
          - Click: Any seller.
          - Click: Seller on the navigation bar in a seller page.
        - Function:
          - Allows users to see the basic information of a seller.
          - Allows users to add a seller to favorite.
    - UI for backend:
      - Login
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
        - Function:
          - Allows users to login use their accounts or use 3rd party accounts to login, including Google, Github, Gitlab, Gitee, Bitbucket and Weibo.
      - Index page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
        - Function:
          - Shows a slider with delicious food.
      - Drawer
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Click: The arrow on the left top corner.
        - Function:
          - Shows some basic information of this app.
      - Users list
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Users on the navigation bar.
        - Function:
          - Shows a table with users in the database and allows users to delete records.
          - Shows a childrow with the basic information of a user when '+' is clicked
      - Add user page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Users on the navigation bar.
          - Click: Add User button at the bottom.
        - Function:
          - Shows the add user page.
      - Edit user page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Users on the navigation bar.
          - Click: Edit icon in a row of the users table.
        - Function:
          - Shows the edit user page, the items of address, pay and favorite can be dynamically added or deleted.
          - Shows the add address option in which Google Map can be used to select address.
      - Sellers list
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Sellers on the navigation bar.
        - Function:
          - Shows a table with sellers in the database and allows users to delete records.
          - Shows a childrow with the basic information of a seller when '+' is clicked
      - Add seller page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Sellers on the navigation bar.
          - Click: Add Seller button at the bottom.
        - Function:
          - Shows the add seller page, image uploading is supported, the items of supports and information can be dynamically added or deleted.
      - Edit seller page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Sellers on the navigation bar.
          - Click: Edit icon in a row of the sellers table.
        - Function:
          - Shows the edit seller page, the uploaded images can be modified, items of supports and information can be dynamically added or deleted.
      - Edit goods of a seller
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Sellers on the navigation bar.
          - Click: Edit goods icon in a row of the sellers table.
        - Function:
          - Shows the edit goods page, image uploading is supported, the items of goods(menus) and food can be dynamically added or deleted.
      - Edit ratings of a seller
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Sellers on the navigation bar.
          - Click: Edit ratings icon in a row of the sellers table.
        - Function:
          - Shows the edit ratings page, the items of ratings can be dynamically added or deleted.
      - Orders list
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Orders on the navigation bar.
        - Function:
          - Shows a table with orders in the database and allows users to delete records.
          - Shows a childrow with the basic information of a order when '+' is clicked.
      - Add order page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Orders on the navigation bar.
          - Click: Add Order button at the bottom.
        - Function:
          - Shows the add order page, the user and seller should be selected, Google Map can be used to select address, the food list is depended on the seller selected.
      - Edit order page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Orders on the navigation bar.
          - Click: Edit icon in a row of the orders table.
        - Function:
          - Shows the edit order page, items of food can be dynamically added or deleted.
      - Comment order page
        - Access:
          - Visit: https://takeawayapp-88d06.firebaseapp.com/admin
          - Login.
          - Click: Orders on the navigation bar.
          - Click: Comment icon in a row of the orders table.
        - Function:
          - Shows the comment order page.
- Server:
  - Urls:
    - [Github](https://github.com/Sam1224/Take-Away-AS)
    - [Gitlab(with CI/CD)](https://gitlab.com/Sam1224/take-away-as-test)
  - Functions:
    >There are 5 routers in the server side, this section only shows a brief description of APIs of the server, a more detailed description can be seen in [Github](https://github.com/Sam1224/Take-Away-AS).
    - user:
      - GET     -     findAll
      - GET     -     findOne
      - POST    -     addUser
      - PUT     -     updateUser
      - POST    -     login
      - GET     -     getToken
      - DELETE  -     deleteUser
      - POST    -     addAddress
      - DELETE  -     deleteAddress
      - POST    -     addPay
      - DELETE  -     deletePay
      - POST    -     addFavorite
      - DELETE  -     deleteFavorite
    - seller:
      - GET     -     findAll
      - GET     -     findOne
      - POST    -     addSeller
      - PUT     -     updateSeller
      - DELETE  -     deleteSeller
      - PUT     -     updateGoods
      - POST    -     addRating
      - DELETE  -     deleteRating
      - POST    -     fuzzySearch
      - GET     -     getTopSellerBySellCount
      - GET     -     getTopSellerByRankRate
    - order:
      - GET     -     findAll
      - GET     -     findOne
      - GET     -     findAllByUser
      - GET     -     findAllBySeller
      - POST    -     addOrder
      - PUT     -     updateOrder
      - DELETE  -     deleteOrder
      - PUT     -     commentOrder
      - GET     -     getTopFood
    - file:
      - GET     -     getImage
      - POST    -     upload
      - POST    -     uploadmul
    - oauth:
      - POST    -     getGithubToken
      - POST    -     getGitlabToken
      - POST    -     getGiteeToken
      - POST    -     getBitbucketToken
      - POST    -     getWeiboToken
- Frameworks used:
  - Client:
    - Vue CLI
    - Vue-Router
    - Vuex
    - Node
  - Server:
    - MongoDB
    - Vue.js
    - Express
    - Node
- 3rd party APIs:
  >This application uses `7` 3rd party APIs in total, they are listed as follow.
  - Maps:
    - Google Maps Javascript API.
  - OAuth2 Logins:
    - Google OAuth2 Login.
    - Github OAuth2 Login.
    - Gitlab OAuth2 Login.
    - Gitee OAuth2 Login.
    - Bitbucket OAuth2 Login.
    - Weibo OAuth2 Login.

## UML Diagrams
- Use case diagrams:
  - Frontend UI of client:
  ![](./assets/Usecase-frontend.png)
  - Backend UI of client:
  ![](./assets/Usercase-backend.png)
  
- Sequence diagrams:
  - Frontend UI of client:
    - Register:
    ![](./assets/Sequence-frontend-register.png)
  - Backend UI of client:
    - Add order:
    ![](./assets/Sequence-backend-addOrder.png)

## Database Schemas
>There are `3` very `complex` and `nested` schemas adopted in the server of this application.

| Data Model | Schema | Samlple Data |
| ---------- | ------ | ------------ |
| User | [User Schema](https://github.com/Sam1224/Take-Away-AS/tree/master/models/user.js) | [User Sample Data](https://github.com/Sam1224/Take-Away-AS/tree/master/data/user.js) |
| Seller | [Seller Schema](https://github.com/Sam1224/Take-Away-AS/tree/master/models/seller.js) | [Seller Sample Data](https://github.com/Sam1224/Take-Away-AS/tree/master/data/seller.js) |
| Order | [Order Schema](https://github.com/Sam1224/Take-Away-AS/tree/master/models/order.js) | [Order Sample Data](https://github.com/Sam1224/Take-Away-AS/tree/master/data/order.js) |

![](./assets/MongoDB.png)

## Git Approach
- Both of the client and server adopts `Git` locally, while using `Github` and also `Gitlab` as the remote repositories for management.
- The status of the repositories are all `public`.
- Please refer to the `commits` for my commiting records.
- The urls of repositories are listed as follow:
  - Client:
    - [Github](https://github.com/Sam1224/Take-Away-AS-Frontend)
    - [Gitlab(with CI/CD)](https://gitlab.com/Sam1224/take-away-as-frontend-test)
  - Server:
    - [Github](https://github.com/Sam1224/Take-Away-AS)
    - [Gitlab(with CI/CD)](https://gitlab.com/Sam1224/take-away-as-test)

## UX/DX Approach
- UX
  - Use a great `navigation bar` in the backend UI of the client.
  - Use plenty of complex UI elements provided by [ElementUI](https://element.eleme.cn/#/en-US/component/installation) and others, e.g. drawer, upload, loading, message box, carousel, collapse, etc.
  - According to the [UI Design Guidelines](https://www.interaction-design.org/literature/article/user-interface-design-guidelines-10-rules-of-thumb), most of the guidelines are considered.
  - According to the [Web Design Rules](https://sharpened.com/web_design_rules), all the rules are met.
- DX
  - Data validation strategy is adopted, almost every table in this application is configured with `rules` for validation.
  - Lots of components are abstracted, implemented and used in this application, e.g. `star`, `cart-control`, `google-map`, etc.
  - The `Git approach` is explained in the previous section.
  - Automated testing:
    - Client:
      - Cypress:
        - [Cypress Dashboard](https://dashboard.cypress.io/projects/hu498k/runs/5/specs)
        - There are `101` test cases in total.
    - Server:
      - Mocha, Chai and lodash:
        - There are `108` test cases in total.
  - Many advanced options of Vue have been used, e.g. vue-router(history mode), vuex, filter, transition, slots, etc.
  - CI/CD:
    - Both of the client and server achieve the goal of CI/CD with the uses of `Gitlab`:
      - Client:
        - Staging:
          - Frontend UI: https://takeawayapp-sam-staging.firebaseapp.com
          - Backend UI: https://takeawayapp-sam-staging.firebaseapp.com/admin
        - Production:
          - Frontend UI: https://takeawayapp-sam-prod.firebaseapp.com
          - Backend UI: https://takeawayapp-sam-prod.firebaseapp.com/admin
      - Server:
        - Staging:
          - https://takeawayapp-sam-staging.herokuapp.com
        - Production:
          - https://takeawayapp-sam-prod.herokuapp.com

## References
- Develop:
  - [Mr. David Drohan's course](https://tutors-design.netlify.com/course/wit-wad-2-2019.netlify.com)
  - [Vue.js](https://vuejs.org/index.html)
  - [Vue CLI](https://cli.vuejs.org/)
  - [Vue Router](https://router.vuejs.org/)
  - [Vuex](https://vuex.vuejs.org/guide/)
  - [Node.js](https://nodejs.org/zh-cn/)
  - [Node's official docs](https://nodejs.org/zh-cn/docs/)
  - [sha1](https://www.npmjs.com/package/js-sha1)
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - [ElementUI](https://element.eleme.cn/#/en-US/component/installation)
  - [A blog about ElementUI - multiple image uploading](https://segmentfault.com/a/1190000015834181)
  - [vue-tables-2](https://github.com/matfish2/vue-tables-2)
  - [better-scroll](https://github.com/ustbhuangyi/better-scroll)

- MongoDB:
  - [MongoDB](https://www.mongodb.com/)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - [Mongoose](https://mongoosejs.com/)
  - [Mongoose docs](http://www.nodeclass.com/api/mongoose.html#quick_start)
  - [A blog of MongoDB about Schema and Model](https://www.jianshu.com/p/29c55aae3d6f)

- Test:
  - [mocha](https://mochajs.org/)
  - [A blog about Mocha](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
  - [lodash](https://lodash.com/)
  - [eslint](https://eslint.org/)
  - [A blog about jwt](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
  - [A blog about jwt](https://www.jb51.net/article/162523.htm)
  - [A blog about jwt](https://segmentfault.com/a/1190000014062679?utm_source=tag-newest)
  - [chai](https://www.chaijs.com/)
  - [Mongodb-Memory-Server](https://github.com/nodkz/mongodb-memory-server)
  - [supertest](https://github.com/visionmedia/supertest)
  - [nyc](https://github.com/istanbuljs/nyc)
  - [nock](https://github.com/nock/nock)
  - [Postman](https://www.getpostman.com/)
  - [local-web-server](https://www.npmjs.com/package/local-web-server)
  - [cypress-file-upload](https://github.com/abramenal/cypress-file-upload)

- OAuth2:
  - [JustAuth](https://github.com/justauth/JustAuth)
  - [A blog about Google OAuth2](https://www.cnblogs.com/zousaili/p/9406886.html)
  - [A blog about Google OAuth2](https://www.cnblogs.com/Oopspw/p/10063241.html)
  - [A blog about OAuth2](https://www.gaojianjian.com/blog/2019-01-10-GitHub-Google-Facebook-Weibo-Third-Party-Login)
  - [A blog about Github OAuth2](https://cloud.tencent.com/developer/article/1423512)
  - [google-api-javascript-client](https://github.com/google/google-api-javascript-client)
  - [A repository about OAuth2 login](https://github.com/hehaibao/h-blog)

- Google Maps:
  - [A blog about Google Maps Javascript API](https://alligator.io/vuejs/vue-google-maps/)

- CI/CD:
  - [A blog about Firebase Hosting Deployment Automation with Gitlab CI](https://medium.com/@rambabusaravanan/firebase-hosting-deployment-automation-with-gitlab-ci-f3fad9130d62)
  - [A blog about Automatically deploy to Firebase with Gitlab CI](https://medium.com/evenbit/automatically-deploy-to-firebase-with-gitlab-ci-546f194c44d8)
  - [Firebase - Share project resources across multiple sites](https://firebase.google.com/docs/hosting/multisites)

- Others:
  - [UI Design Guidelines](https://www.interaction-design.org/literature/article/user-interface-design-guidelines-10-rules-of-thumb)
  - [Web Design Rules](https://sharpened.com/web_design_rules)
  - [TOC generator](https://ecotrust-canada.github.io/markdown-toc/)
