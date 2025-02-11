import { Op, Sequelize } from 'sequelize';
import { CookingRecipeMapper } from '../mappers';
import { CookingRecipeMakeWayRepository, CookingRecipeMenuMapperRepository, CookingRecipeMenuRepository, CookingRecipeRepository, CookingRecipeTypeDishRepository } from '../repositories';
import BaseService from './BaseService';
import HelperService from './HelperService';
import AWSService from './AWSService';
import { extname } from 'path';
import axios from 'axios';
import { stripTypeScriptTypes } from 'module';
import { LoggerError } from '../helpers/logger';
import { sequelize } from '../helpers/database';
import { CookingRecipeMakeWayModel, CookingRecipeMenuModel, CookingRecipeTypeDishModel } from '../models';

class CookingRecipeService extends BaseService {

    constructor() {
        super();
        // mapper
        this.cookingRecipeMapper = new CookingRecipeMapper();
        // service
        this.helperService = new HelperService();
        this.awsService = new AWSService();
        // repository
        this.cookingRecipeRepository = new CookingRecipeRepository();
        this.cookingRecipeMenuRepository = new CookingRecipeMenuRepository();
        this.cookingRecipeTypeDishRepository = new CookingRecipeTypeDishRepository();
        this.cookingRecipeMakeWayRepository = new CookingRecipeMakeWayRepository();
        this.cookingRecipeMenuMapperRepository = new CookingRecipeMenuMapperRepository();

    }

    // #region Create
    async asyncCreateCookingRecipe(payload) {
        const transaction = await sequelize.transaction();
        try {
            const { name, menus, typeDish, makeWay, image, introduce, ingredients, ration, totalTime, instructions, userId } = payload;

            // kiểm tra giá trị menus
            if (menus?.length > 0) {
                const existedMenus = await this.cookingRecipeMenuRepository.findAll({
                    id: {
                        [Op.in]: menus
                    }
                });

                if (existedMenus.length !== menus.length) {
                    return this.result(false, 400, this.messages.COOKING_RECIPE_MENU_INVALID);
                }
            }

            // kiểm tra giá trị typeDish
            if (typeDish) {
                const existedTypeDish = await this.cookingRecipeTypeDishRepository.findOne({
                    id: typeDish
                });

                if (!existedTypeDish) {
                    return this.result(false, 400, this.messages.COOKING_RECIPE_TYPE_DISH_INVALID);
                }
            }

            // kiểm tra giá trị makeWay
            if (makeWay) {
                const existedMakeWay = await this.cookingRecipeMakeWayRepository.findOne({
                    id: makeWay
                });

                if (!existedMakeWay) {
                    return this.result(false, 400, this.messages.COOKING_RECIPE_MAKE_WAY_INVALID);
                }
            }

            // tạo code cho thực đơn
            const code = await this.helperService.asyncGenerateCode(this.cookingRecipeRepository);

            // tải ảnh lên S3
            let filename;
            if (image?.filename) {
                filename = `${code}_${Date.now()}${extname(image.filename)}`;
                const uploadResult = await this.awsService.asyncPutObject(
                    this.awsService.awsBucket,
                    `${this.awsService.awsCookingRecipeImage}/${filename}`,
                    `${this.filePath}/${image.filename}`
                );
                if (!uploadResult) return this.result(false, 500, this.messages.SERVER_ERROR);
            }

            // tạo công thức nấu ăn
            const slug = this.helperService.generateSlug(`${name}-${code}`);

            const newCookingRecipe = await this.cookingRecipeRepository.create({
                code,
                name,
                slug,
                introduce,
                menus,
                type_dish: typeDish || null,
                make_way: makeWay || null,
                image: filename ?? null,
                ingredients,
                ration,
                total_time: totalTime,
                instructions,
                create_by: userId,
                status: this.constants.STATUS.ACTIVE
            }, {
                transaction
            });

            // tạo menu mapper
            if (newCookingRecipe?.id && menus.length > 0) {
                const menuMappersCreateData = menus.map((menuId) => ({
                    cooking_recipe_id: newCookingRecipe.id,
                    menu_id: menuId
                }));

                await this.cookingRecipeMenuMapperRepository.createList(menuMappersCreateData, {
                    transaction
                });
            }

            // commit transaction
            await transaction.commit();
            return this.result(true, 200);
        } catch (error) {
            // rollback transaction
            await transaction.rollback();
            LoggerError.debug('asyncUpdateCookingRecipe', error);
            return this.result(false, 500, this.messages.SERVER_ERROR);
        }

    }

    // #endregion

    // #region Get
    async asyncGetCookingRecipeSecondaryData(payload) {
        let result = {};
        const secondaryData = [
            {
                keyQuery: 'cookingRecipeMenu',
                keyReturn: 'cookingRecipeMenus',
                repositoryInstance: this.cookingRecipeMenuRepository
            },
            {
                keyQuery: 'cookingRecipeTypeDish',
                keyReturn: 'cookingRecipeTypeDishs',
                repositoryInstance: this.cookingRecipeTypeDishRepository
            },
            {
                keyQuery: 'cookingRecipeMakeWay',
                keyReturn: 'cookingRecipeMakeWays',
                repositoryInstance: this.cookingRecipeMakeWayRepository
            }
        ];

        await Promise.all(secondaryData.filter((itemQuery) => payload[itemQuery.keyQuery]).map(async (itemQuery) => {
            const queryData = await itemQuery.repositoryInstance.findAll({}, {
                attributes: [
                    'id',
                    'name',
                    'delete_flag'
                ]
            });

            if (queryData.length) {
                result[itemQuery.keyReturn] = queryData.map((item) => this.cookingRecipeMapper.responseCookingRecipeSecondaryData(item.dataValues));
            }
        }));

        return this.result(true, 200, null, result);
    }

    async asyncGetListCookingRecipe(payload, options = {}) {
        const { mapperFunction, countTotalCookingRecipes } = options;
        const {
            userId,
            size = -1, page = 1, sorting = [],
            code, name,
            status, displayedCookingRecipes,
            slug, isRelated,
            menus, typeDishs, makeWays
        } = payload;

        // kiểm tra có phải lấy random data không
        let isShuffle;
        if (sorting instanceof Array && sorting.length > 0 && sorting.find((e) => e.sortKey === 'shuffle')) {
            isShuffle = true;
        }

        // kiểm tra lấy món ăn tương tự
        let cookingRecipe;
        if (isRelated) {
            cookingRecipe = await this.cookingRecipeRepository.findOne({
                [Op.or]: [
                    {
                        slug
                    },
                    {
                        code: this.helperService.getCodeFromSlug(slug)
                    }
                ]
            });
        }

        // tổng hợp search options
        const searchOpions = {
            ...userId ?
                {
                    create_by: userId
                } :
                {},
            ...code ?
                {
                    code: {
                        [Op.like]: `%${code}%`
                    }
                } :
                {},
            ...name ?
                [
                    Sequelize.where(Sequelize.fn(
                        'SUBSTRING_INDEX',
                        Sequelize.col('cooking_recipes.slug'),
                        Sequelize.literal('"-"'),
                        Sequelize.literal('LENGTH(cooking_recipes.slug) - LENGTH(REPLACE(cooking_recipes.slug, "-", ""))')
                    ), {
                        [Op.like]: `%${this.helperService.generateSlug(name)}%`
                    })
                ] :
                {},
            ...status ?
                {
                    status
                } :
                {},
            ...typeDishs?.length > 0 ?
                {
                    type_dish: {
                        [Op.in]: typeDishs
                    }
                } :
                {},
            ...makeWays?.length > 0 ?
                {
                    make_way: {
                        [Op.in]: makeWays
                    }
                } :
                {},
            // lấy món ăn tương tự
            ...isRelated && cookingRecipe ?
                {
                    [Op.and]: [
                        {
                            id: {
                                [Op.ne]: cookingRecipe.id
                            }
                        },
                        {
                            [Op.or]: [
                                {
                                    type_dish: cookingRecipe.type_dish
                                },
                                {
                                    make_way: cookingRecipe.make_way
                                }
                            ]
                        }
                    ]
                } :
                {}
        };

        // lọc theo thực đơn
        let includes = [];
        if (menus?.length > 0) {
            includes.push({
                model: CookingRecipeMenuModel,
                where: {
                    id: {
                        [Op.in]: menus
                    }
                },
                required: true,
                through: {
                    attributes: []
                }
            });
        }

        // phân trang kết quả
        let result = await this.cookingRecipeRepository.paginate({
            limit: size,
            page,
            options: {
                ...searchOpions,
                ...displayedCookingRecipes?.length > 0 ?
                    {
                        id: {
                            [Op.notIn]: displayedCookingRecipes
                        }
                    } :
                    {}

            },
            ...sorting?.length > 0 ?
                {
                    orders: sorting
                } :
                {},
            isShuffle,
            includes
        });

        // format kết quả
        if (result.elements.length > 0) {
            result.elements = result.elements.map((element) => {
                if (mapperFunction) return mapperFunction(element.dataValues); // nếu truyền hàm mapper kết quả trả về
                return this.cookingRecipeMapper.responseMyListCookingRecipe(element.dataValues);
            });
        }

        // count total cooking recipes
        if (countTotalCookingRecipes) {
            result.totalCookingRecipes = await this.cookingRecipeRepository.getCount({
                optionAll: searchOpions,
                includes
            });
        }

        return this.result(true, 200, null, result);
    }

    async asyncGetCookingRecipe(payload) {
        const { code, userId, slug } = payload;

        // kiểm tra công thức
        const existedCookingRecipe = await this.cookingRecipeRepository.findOne({
            ...code ?
                {
                    code
                } :
                {},
            ...userId ?
                {
                    create_by: userId
                } :
                {},
            ...slug ?
                {
                    [Op.or]: [
                        {
                            slug
                        },
                        {
                            code: this.helperService.getCodeFromSlug(slug)
                        }
                    ]
                } :
                {}
        }, {
            includes: [
                {
                    model: CookingRecipeMenuModel,
                    where: {
                        delete_flag: this.constants.DELETE_FLAG.NOT_DELETE
                    },
                    required: false
                },
                {
                    model: CookingRecipeTypeDishModel,
                    where: {
                        delete_flag: this.constants.DELETE_FLAG.NOT_DELETE
                    },
                    required: false
                },
                {
                    model: CookingRecipeMakeWayModel,
                    where: {
                        delete_flag: this.constants.DELETE_FLAG.NOT_DELETE
                    },
                    required: false
                }
            ]
        });

        if (!existedCookingRecipe) return this.result(false, 404, this.messages.COOKING_RECIPE_NOT_EXISTED);

        const result = this.cookingRecipeMapper.responseCookingRecipe(existedCookingRecipe.dataValues);

        return this.result(true, 200, null, result);
    }
    // #endregion

    // #region Update
    async asyncUpdateStatusCookingRecipe(payload) {
        const { code, userId, status } = payload;

        // kiểm tra công thức
        const existedCookingRecipe = await this.cookingRecipeRepository.findOne({
            code,
            create_by: userId
        });
        if (!existedCookingRecipe) return this.result(false, 400, this.messages.COOKING_RECIPE_NOT_EXISTED);

        // Kiểm tra trạng thái
        if (existedCookingRecipe.status !== status) {
            // cập nhật trạng thái
            await this.cookingRecipeRepository.update({
                options: {
                    id: existedCookingRecipe.id
                },
                data: {
                    status
                }
            });
        }

        return this.result(true, 200, this.messages.UPDATE_SUCCESS);
    }

    async asyncUpdateCookingRecipe(payload) {
        const transaction = await sequelize.transaction();
        try {
            const {
                code, userId,
                name, menus, typeDish, makeWay, image, introduce, ingredients, ration, totalTime, instructions
            } = payload;

            // kiểm tra công thức
            const existedCookingRecipe = await this.cookingRecipeRepository.findOne({
                code,
                create_by: userId
            }, {
                includes: [
                    {
                        model: CookingRecipeMenuModel,
                        required: false
                    }
                ]
            });
            if (!existedCookingRecipe) return this.result(false, 400, this.messages.COOKING_RECIPE_NOT_EXISTED);

            // kiểm tra giá trị menus
            if (menus?.length > 0) {
                const existedMenus = await this.cookingRecipeMenuRepository.findAll({
                    id: {
                        [Op.in]: menus
                    }
                });

                if (existedMenus.length !== menus.length) {
                    return this.result(false, 400, this.messages.COOKING_RECIPE_MENU_INVALID);
                }

                // Xác định menu cần thêm và menu cần xóa
                const existedCookingRecipeMenus = existedCookingRecipe.cooking_recipe_menus?.length > 0 ? existedCookingRecipe.cooking_recipe_menus.map((e) => e.id) : [];
                const newMenus = menus.filter((id) => !existedCookingRecipeMenus.includes(id));
                const removeMenus = existedCookingRecipeMenus.filter((id) => !menus.includes(id));

                // tạo menu mới
                if (newMenus.length > 0) {
                    const newMenusData = newMenus.map((menuId) => ({
                        cooking_recipe_id: existedCookingRecipe.id,
                        menu_id: menuId
                    }));

                    await this.cookingRecipeMenuMapperRepository.createList(newMenusData, {
                        transaction
                    });
                }

                // xóa menu cũ
                if (removeMenus?.length > 0) {
                    await this.cookingRecipeMenuMapperRepository.delete({
                        cooking_recipe_id: existedCookingRecipe.id,
                        menu_id: {
                            [Op.in]: removeMenus
                        }
                    }, {
                        transaction
                    });
                }
            }

            // kiểm tra giá trị typeDish
            if (typeDish) {
                const existedTypeDish = await this.cookingRecipeTypeDishRepository.findOne({
                    id: typeDish
                });

                if (!existedTypeDish) {
                    return this.result(false, 400, this.messages.COOKING_RECIPE_TYPE_DISH_INVALID);
                }
            }

            // kiểm tra giá trị makeWay
            if (makeWay) {
                const existedMakeWay = await this.cookingRecipeMakeWayRepository.findOne({
                    id: makeWay
                });

                if (!existedMakeWay) {
                    return this.result(false, 400, this.messages.COOKING_RECIPE_MAKE_WAY_INVALID);
                }
            }

            // kiểm tra ảnh
            let filename, oldImage;
            if (image?.filename) {
                filename = `${existedCookingRecipe.code}_${Date.now()}${extname(image.filename)}`;
                const uploadResult = await this.awsService.asyncPutObject(
                    this.awsService.awsBucket,
                    `${this.awsService.awsCookingRecipeImage}/${filename}`,
                    `${this.filePath}/${image.filename}`
                );
                if (!uploadResult) return this.result(false, 500, this.messages.SERVER_ERROR);

                oldImage = existedCookingRecipe.image;
            } else {
                filename = this.awsService.getFilenameFromUrl(image);
            }

            // cập nhật công thức
            await this.cookingRecipeRepository.update({
                options: {
                    id: existedCookingRecipe.id
                },
                data: {
                    name,
                    introduce,
                    menus,
                    type_dish: typeDish || null,
                    make_way: makeWay || null,
                    image: filename ?? null,
                    ingredients,
                    ration,
                    total_time: totalTime,
                    instructions,
                    ...existedCookingRecipe.name !== name ?
                        {
                            slug: this.helperService.generateSlug(`${name}-${existedCookingRecipe.code}`)
                        } :
                        {}

                }
            }, {
                transaction
            });

            // xóa ảnh cũ
            if (oldImage) {
                this.awsService.asyncDeleteObject(this.awsService.awsBucket, `${this.awsService.awsCookingRecipeImage}/${oldImage}`);
            }

            await transaction.commit();
            return this.result(true, 200, this.messages.UPDATE_SUCCESS);
        } catch (error) {
            await transaction.rollback();
            LoggerError.debug('asyncUpdateCookingRecipe', error);
            return this.result(false, 500, this.messages.SERVER_ERROR);
        }
    }

    // #endregion

    // #region Delete
    async asyncDeleteMyCookingRecipe(payload) {
        const { code, userId } = payload;

        // kiểm tra công thức
        const existedCookingRecipe = await this.cookingRecipeRepository.findOne({
            code,
            create_by: userId
        });
        if (!existedCookingRecipe) return this.result(false, 400, this.messages.COOKING_RECIPE_NOT_EXISTED);

        // xóa công thức
        await this.cookingRecipeRepository.deleteByFlag({
            id: existedCookingRecipe.id
        });

        return this.result(true, 200, this.messages.DELETE_SUCCESS);
    }
    // #endregion

    // #region crawl dữ liệu từ trang cooky
    async asyncCrawlDataFromCookyVn() {
        const transaction = await sequelize.transaction();
        try {
            const NUMBER_PAGES_CRAWL = process.env.NUMBER_PAGES_CRAWL ? Number(process.env.NUMBER_PAGES_CRAWL) : 1; // 1 page = 12 bản ghi
            const START_PAGE = 2;
            const TYPE_CRAWL = process.env.TYPE_CRAWL || '1';
            const cookingRecipesCrawl = [];
            await Promise.all(Array.from({
                length: NUMBER_PAGES_CRAWL
            }).map(async (_, pageIndex) => {
                let cookingRecipes;
                // lấy món loại 1: món chính, nướng quay, quay nướng
                if (TYPE_CRAWL == '1') {
                    // eslint-disable-next-line @stylistic/js/max-len
                    cookingRecipes = await axios.get(`https://www.cooky.vn/directory/search?q=null&st=2&lv=&cs=&cm=36&dt=128&igt=&oc=&p=&crs=4&page=${pageIndex + START_PAGE}&pageSize=12&append=true&video=false`);
                }

                // lấy món loại 2: món tráng miệng, sữa chua
                if (TYPE_CRAWL == '2') {
                    // eslint-disable-next-line @stylistic/js/max-len
                    cookingRecipes = await axios.get(`https://www.cooky.vn/directory/search?q=null&st=2&lv=&cs=&cm=&dt=140&igt=&oc=&p=&crs=2&page=${pageIndex + START_PAGE}&pageSize=12&append=false&video=false`);
                }

                // lấy món loại 3: bánh-bánh ngọt, bánh ngọt, quay nướng
                if (TYPE_CRAWL == '3') {
                    // eslint-disable-next-line @stylistic/js/max-len
                    cookingRecipes = await axios.get(`https://www.cooky.vn/directory/search?q=null&st=2&lv=&cs=&cm=36&dt=114&igt=&oc=&p=&crs=8&page=${pageIndex + START_PAGE}&pageSize=12&append=true&video=false`);
                }

                if (cookingRecipes.data?.recipes?.length > 0) {
                    await Promise.all(cookingRecipes.data.recipes.map(async (recipe) => {
                        if (recipe.Id) {
                            // eslint-disable-next-line @stylistic/js/max-len
                            const cookingRecipe = await axios.get(`https://marketapi.cooky.vn/recipe/v1.3/detail?checksum=${this.helperService.generateUuidAlphabet(this.constants.ALPHABET_GENERATE_UUID.LOW_ALPHABET_NUMBER, 32)}&id=${recipe.Id}`);

                            if (cookingRecipe.data?.data && !cookingRecipesCrawl.find(crawl => crawl.id === cookingRecipe.data.data.id)) {
                                cookingRecipesCrawl.push(cookingRecipe.data.data);
                            }
                        }
                    }));
                }
            }));

            if (cookingRecipesCrawl.length > 0) {
                for (let index = 0; index < cookingRecipesCrawl.length; index++) {
                    const cookingRecipe = cookingRecipesCrawl[index];

                    // tạo code cho thực đơn
                    const code = await this.helperService.asyncGenerateCode(this.cookingRecipeRepository);
                    const name = cookingRecipe?.name;
                    const slug = this.helperService.generateSlug(`${name}-${code}`);
                    const introduce = cookingRecipe.description?.replace(/<[^>]+>/g, '').trim();
                    let menus, type_dish, make_way;
                    // loại 1
                    if (TYPE_CRAWL == '1') {
                        menus = [4]; // món chính
                        type_dish = 7; // nướng quay
                        make_way = 4; // quay nướng
                    }

                    // loại 2
                    if (TYPE_CRAWL == '2') {
                        menus = [2]; // món tráng miệng;
                        type_dish = 18; // nướng quay
                        make_way = null;
                    }

                    // loại 3
                    if (TYPE_CRAWL == '3') {
                        menus = [8]; // bánh-bánh ngọt
                        type_dish = 28; // bánh ngọt
                        make_way = 4; // quay nướng
                    }

                    // xử lý lấy ảnh
                    let filename;
                    if (cookingRecipe.photos?.[0]?.[0]?.url) {
                        filename = `${code}_${Date.now()}.${new URL(cookingRecipe.photos?.[0]?.[0]?.url).pathname.split('.').pop().toLowerCase()}`;
                        // Tải ảnh từ URL
                        const response = await axios.get(cookingRecipe.photos?.[0]?.[0]?.url, {
                            responseType: 'arraybuffer'
                        });

                        // upload lên S3
                        const uploadParams = {
                            Bucket: this.awsService.awsBucket,
                            Key: `${this.awsService.awsCookingRecipeImage}/${filename}`, // Tên file trong S3
                            Body: Buffer.from(response.data), // Dữ liệu ảnh
                            ContentType: response.headers['content-type'] // Giữ nguyên loại MIME
                        };
                        await this.awsService.s3.putObject(uploadParams).promise();
                    }
                    const image = filename ?? null;
                    const ration = cookingRecipe.servings || 1;
                    const total_time = cookingRecipe.totalTime || 45;
                    const create_by = 1;
                    const status = this.constants.STATUS.ACTIVE;
                    let ingredients = [],
                        instructions = [];

                    // ingredients
                    if (cookingRecipe.ingredients?.length > 0) {
                        ingredients = cookingRecipe.ingredients.map((ingredient) => {
                            const name = ingredient?.name ?? '';

                            if (ingredient?.unit && ingredient?.quantity) {
                                return `${name} ${ingredient.quantity} ${ingredient.unit.unit}`;
                            }

                            return name;
                        });
                    }

                    // instructions
                    if (cookingRecipe.steps?.length > 0) {
                        instructions = cookingRecipe.steps.map((step) => step.content.replace(/<[^>]+>/g, '').trim());
                    }

                    const dataCreate = {
                        code,
                        name,
                        slug,
                        introduce,
                        type_dish,
                        make_way,
                        image,
                        ration,
                        total_time,
                        create_by,
                        status,
                        ingredients,
                        instructions
                    };

                    // tạo công thức
                    const newCookingRecipe = await this.cookingRecipeRepository.create(dataCreate, {
                        transaction
                    });

                    // tạo menu mapper
                    if (newCookingRecipe?.id && menus.length > 0) {
                        const menuMappersCreateData = menus.map((menuId) => ({
                            cooking_recipe_id: newCookingRecipe.id,
                            menu_id: menuId
                        }));

                        await this.cookingRecipeMenuMapperRepository.createList(menuMappersCreateData, {
                            transaction
                        });
                    }
                }
            }

            // commit transaction
            await transaction.commit();
            console.log('CRAWL_DATA_FROM_COOKY_VN_SUCCESS');
        } catch (error) {
            // rollback transaction
            await transaction.rollback();
            LoggerError.debug('CRAWL_DATA_FROM_COOKY_VN', error);
        }
    }
    // #endregion
}

export default CookingRecipeService;
