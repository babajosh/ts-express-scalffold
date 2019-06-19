import { AppEnv } from "./_env-def.config";
import { Options } from "sequelize";


export type DbConfig = {[key in AppEnv]: Options};

const configs: DbConfig = {
    'development': {
        database: process.env.DEV_DB_NAME || 'vicoba',
        dialect:  'postgres',
        username: process.env.DEV_DB_USER || 'postgres',
        password: process.env.DEV_DB_PASS || 'root'
    },
    'production': {
        database: process.env.DB_NAME,
        dialect:  process.env.DB_DIALECT as Options["dialect"],
        username: process.env.DB_USER,
        password: process.env.DB_PASS
    },
    'test': {
        database: process.env.CI_DB_NAME,
        dialect:  process.env.CI_DB_DIALECT as Options["dialect"],
        username: process.env.CI_DB_USER,
        password: process.env.CI_DB_PASS
    }
};

export function getDbConfig(appEnv: AppEnv) {
    console.log(appEnv);
    return configs['development'];
}
