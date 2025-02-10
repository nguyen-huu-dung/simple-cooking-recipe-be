import { Router } from 'express';
import { pickerHandler } from '../helpers/routeHandler';
import { authorization } from '../middlewares/authorization';
import { uploadSingleImage } from '../middlewares/upload';

const AuthRouter = Router();

AuthRouter.use(authorization);

// #region authentication
AuthRouter.post('/sign-out', pickerHandler('AuthController@asyncSignOut'));

// #endregion

// #region profile
AuthRouter.get('/profile', pickerHandler('AuthController@asyncGetProfile'));
AuthRouter.put('/profile', pickerHandler('AuthController@asyncUpdateProfile'));

// #endregion

// #region cooking recipe
AuthRouter.post('/my-cooking-recipe', uploadSingleImage('image'), pickerHandler('CookingRecipeController@asyncCreateMyCookingRecipe'));
AuthRouter.get('/my-cooking-recipe', pickerHandler('CookingRecipeController@asyncGetMyListCookingRecipe'));
AuthRouter.get('/my-cooking-recipe/:code', pickerHandler('CookingRecipeController@asyncGetMyCookingRecipe'));
AuthRouter.put('/my-cooking-recipe/status/:code', pickerHandler('CookingRecipeController@asyncUpdateStatusMyCookingRecipe'));
AuthRouter.put('/my-cooking-recipe/:code', uploadSingleImage('image'), pickerHandler('CookingRecipeController@asyncUpdateMyCookingRecipe'));
AuthRouter.delete('/my-cooking-recipe/:code', pickerHandler('CookingRecipeController@asyncDeleteMyCookingRecipe'));

// #endregion

export default AuthRouter;
