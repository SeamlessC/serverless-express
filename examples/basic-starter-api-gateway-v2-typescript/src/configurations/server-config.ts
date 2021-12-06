import express from 'express';
import { MongoConnection } from './mongo';
import { IndexRoutes } from '../routes/index.routes';
import * as dotenv from 'dotenv';
var cors = require('cors')


class App {
    public app: express.Application;
    private index_routes: IndexRoutes = new IndexRoutes();
    private mongo_connection: MongoConnection = new MongoConnection();

    constructor() {
        this.app = express();
        this.app.use(cors({ origin: true }))
        this.config();
        dotenv.config();
        this.mongo_connection.connect();
        this.index_routes.route(this.app);

    }

    private config(): void {
        // support application/json type post data
        this.app.use(express.json({ limit: '5mb' }));
        // support application/x-www-form-urlencoded post data
        this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));

        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', "*");

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');

            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.url.substr(0, 4) === '/api') {
                req.url = req.url.substr(4);
            }

            next();
        });
    }

}

export default new App().app;