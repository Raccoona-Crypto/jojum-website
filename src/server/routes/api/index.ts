import express from 'express';
import bodyParser from 'body-parser';

export default function createApiRouter(): express.Router {
    const apiRouter = express.Router();

    apiRouter.use(bodyParser.json());

    return apiRouter;
}
