import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import config from 'config';
import http from 'http';
import { LoggerSystem } from './helpers/logger';
import { routers } from './routers';
import { models } from './models';
import { connectDatabase } from './helpers/database';
import { CookingRecipeService } from './services';

const app = express();
const server = http.createServer(app);
const HOSTNAME = config.get('hostname') || '0.0.0.0';
const PORT = config.get('port') || 3000;
const allowedOrigins = [
    process.env.APP_CMS_URL,
    process.env.APP_END_USER_URL,
    ...process.env.OTHERS_ALLOWED_ORIGINS ?? []
];

// middleware
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        exposedHeaders: ['Content-Disposition']
    })
);

app.use(
    express.json({
        limit: '100mb'
    })
);

// connect database
connectDatabase(models);

// route server
routers(app);

// start server
server.listen(PORT, () => {
    console.log(`Server is listening at ${HOSTNAME}:${PORT}`);
    LoggerSystem.info(`Server is listening at ${HOSTNAME}:${PORT}`);

    // crawl data
    if (process.env.IS_CRAWL === 'TRUE') {
        new CookingRecipeService().asyncCrawlDataFromCookyVn();
    }
});
