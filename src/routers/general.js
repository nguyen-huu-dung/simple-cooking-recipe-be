import { Router } from 'express';
import { pickerHandler } from '../helpers/routeHandler';

const GeneralRouter = Router();

// #region general
// healthy check api active
GeneralRouter.get('/healthy', (req, res) => {
    res.status(200).send('Health check successful!');
});

// get ip client
GeneralRouter.get('/my-ip', (req, res) => {
    res.status(200).send(`Your IP is ${req.ip}`);
});

// #endregion

// #region authentication
GeneralRouter.post('/sign-in-with-otp', pickerHandler('AuthController@asyncSignInWithOTP'));
GeneralRouter.post('/sign-in-with-otp/confirm', pickerHandler('AuthController@asyncConfirmSignInWithOTP'));

// #endregion

// #region cooking recipe
GeneralRouter.get('/cooking-recipe-secondary-data', pickerHandler('CookingRecipeController@asyncGetCookingRecipeSecondaryData'));
GeneralRouter.post('/cooking-recipe', pickerHandler('CookingRecipeController@asyncGetListCookingRecipe'));
GeneralRouter.get('/cooking-recipe/:slug', pickerHandler('CookingRecipeController@asyncGetCookingRecipe'));

// #endregion

export default GeneralRouter;
