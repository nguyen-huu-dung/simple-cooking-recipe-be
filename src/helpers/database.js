import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { LoggerError, LoggerSystem } from './logger';

const databaseConnection = process.env.DATABASE_CONNECTION;

export const sequelize = new Sequelize(databaseConnection, {
    logging: false,
    dialectOptions: {},
    pool: {
        acquire: 60000,
        max: 30
    }
});

const asyncModels = async (models) => {
    if (models?.length > 0) {
        await Promise.all(models.map(async (model) => {
            await model.sync({
                alter: true
            });
        }));
    }
};

export const connectDatabase = async (models) => {
    try {
        // authen database
        await sequelize.authenticate();

        // init models
        // await asyncModels(models);

        console.log('Database connection has been established successfully!');
        LoggerSystem.info('Database connection successful');
    } catch (error) {
        console.log('Unable to connect to the database', error);
        LoggerError.error('Cannot connect database: ', error);
    }

};
