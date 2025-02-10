import log4js from 'log4js';
import config from 'config';
log4js.configure(config.get('log4js'));

const LoggerSystem = log4js.getLogger('system');
const LoggerError = log4js.getLogger('error');

export { LoggerSystem, LoggerError };
