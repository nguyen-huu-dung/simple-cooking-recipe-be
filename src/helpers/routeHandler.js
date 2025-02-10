import controllers from '../controllers';

const asyncMiddleware = ({ object, method, payload }) => (req, res, next) => Promise.resolve(object[method](req, res, next, payload)).catch(next);

export const pickerHandler = (handlerDef, payload) => {
    const [handlerController, handlerMethod] = handlerDef.split('@');
    const classHandler = controllers[handlerController];
    const object = new classHandler();
    return asyncMiddleware({
        object,
        method: handlerMethod,
        payload
    });
};
