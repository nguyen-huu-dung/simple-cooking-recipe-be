import { CookingRecipeMapper } from '../mappers';
import { CookingRecipeService } from '../services';
import FileUtil from '../utils/FileUtil';
import { CookingRecipeValidate } from '../validations';
import BaseController from './BaseController';

class CookingRecipeController extends BaseController {

    constructor() {
        super();
        // util
        this.fileUtil = new FileUtil();
        // validate
        this.cookingRecipeValidate = new CookingRecipeValidate();
        // mapper
        this.cookingRecipeMapper = new CookingRecipeMapper();
        // service
        this.cookingRecipeService = new CookingRecipeService();
    }

    // #region [GET COOKING RECIPE SECONDARY DATA]
    asyncGetCookingRecipeSecondaryData(req, res, next) {
        const LOG_TITLE = '[GET COOKING RECIPE SECONDARY DATA]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            return this.cookingRecipeService.asyncGetCookingRecipeSecondaryData(req.query);
        });
    }
    // #endregion

    // #region [CREATE MY COOKING RECIPE]
    asyncCreateMyCookingRecipe(req, res, next) {
        const LOG_TITLE = '[CREATE MY COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            // validate
            const { error, value } = this.cookingRecipeValidate.createCookingRecipe(req.body);
            if (error) {
                return this.result(false, 400, this.messages.BAD_REQUEST);
            }

            return this.cookingRecipeService.asyncCreateCookingRecipe({
                ...value,
                userId: req.user?.id,
                image: req.file ?? null
            });
        }, {
            finally: () => {
                if (req.file && req.file.filename) {
                    this.fileUtil.deleteFileIfExist(`${this.fileUtil.filePath}/${req.file.filename}`);
                }
            }
        });
    }
    // #endregion

    // #region [GET MY LIST COOKING RECIPE]
    asyncGetMyListCookingRecipe(req, res, next) {
        const LOG_TITLE = '[GET MY LIST COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            return this.cookingRecipeService.asyncGetListCookingRecipe({
                ...req.query,
                userId: req.user?.id
            });
        });
    }
    // #endregion

    // #region [GET LIST COOKING RECIPE]
    asyncGetListCookingRecipe(req, res, next) {
        const LOG_TITLE = '[GET LIST COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            return this.cookingRecipeService.asyncGetListCookingRecipe({
                ...req.body,
                status: this.constants.STATUS.ACTIVE
            }, {
                mapperFunction: this.cookingRecipeMapper.responseListCookingRecipe.bind(this.cookingRecipeMapper),
                countTotalCookingRecipes: true
            });
        });
    }
    // #endregion

    // #region [GET MY COOKING RECIPE]
    asyncGetMyCookingRecipe(req, res, next) {
        const LOG_TITLE = '[GET MY COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            return this.cookingRecipeService.asyncGetCookingRecipe({
                code: req.params.code,
                userId: req.user?.id
            });
        });
    }
    // #endregion

    // #region [GET COOKING RECIPE]
    asyncGetCookingRecipe(req, res, next) {
        const LOG_TITLE = '[GET COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            return this.cookingRecipeService.asyncGetCookingRecipe({
                slug: req.params.slug,
                isDetail: true
            });
        });
    }
    // #endregion

    // #region [UPDATE STATUS MY COOKING RECIPE]
    asyncUpdateStatusMyCookingRecipe(req, res, next) {
        const LOG_TITLE = '[UPDATE STATUS MY COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            // validate
            const { error, value } = this.cookingRecipeValidate.updateStatusCookingRecipe(req.body);
            if (error) {
                return this.result(false, 400, this.messages.BAD_REQUEST);
            }

            return this.cookingRecipeService.asyncUpdateStatusCookingRecipe({
                ...value,
                code: req.params.code,
                userId: req.user?.id
            });
        });
    }
    // #endregion

    // #region [UPDATE MY COOKING RECIPE]
    asyncUpdateMyCookingRecipe(req, res, next) {
        const LOG_TITLE = '[UPDATE MY COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            // validate
            const { error, value } = this.cookingRecipeValidate.updateCookingRecipe(req.body);
            if (error) {
                return this.result(false, 400, this.messages.BAD_REQUEST);
            }

            return this.cookingRecipeService.asyncUpdateCookingRecipe({
                ...value,
                code: req.params.code,
                userId: req.user?.id,
                image: req.file ?? value.image ?? null
            });
        }, {
            finally: () => {
                if (req.file && req.file.filename) {
                    this.fileUtil.deleteFileIfExist(`${this.fileUtil.filePath}/${req.file.filename}`);
                }
            }
        });
    }
    // #endregion

    // #region [DELETE MY COOKING RECIPE]
    asyncDeleteMyCookingRecipe(req, res, next) {
        const LOG_TITLE = '[DELETE MY COOKING RECIPE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            return this.cookingRecipeService.asyncDeleteMyCookingRecipe({
                code: req.params.code,
                userId: req.user?.id
            });
        });
    }
    // #endregion
}

export default CookingRecipeController;
