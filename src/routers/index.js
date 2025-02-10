import AuthRouter from './authorization';
import GeneralRouter from './general';

const versionApi = '/api/v1';

export const routers = (app) => {

    app.use(`${versionApi}`, GeneralRouter);
    app.use(`${versionApi}`, AuthRouter);
};
