import { AWSService } from '../services';
class CookingRecipeMapper {

    constructor() {
        // service
        this.awsService = new AWSService();
    }

    responseCookingRecipeSecondaryData(data) {
        const { id, name } = data;

        return {
            id,
            name
        };
    }

    responseMyListCookingRecipe(data) {
        const { code, name, slug, status, created_at: createdAt, updated_at: updatedAt } = data;

        return {
            code,
            name,
            slug,
            status,
            createdAt,
            updatedAt
        };
    }

    responseListCookingRecipe(data) {
        const { id, code, name, slug, introduce, image, total_time: totalTime } = data;

        return {
            id,
            code,
            name,
            slug,
            introduce,
            image: this.awsService.generateFileUrl(this.awsService.awsCookingRecipeImage, image),
            totalTime
        };
    }

    responseCookingRecipe(data) {
        const {
            code, name,
            cooking_recipe_menus: cookingRecipeMenus, cooking_recipe_type_dish: cookingRecipeTypeDish, cooking_recipe_make_way: cookingRecipeMakeWay,
            image, introduce, ingredients, ration, total_time: totalTime, instructions
        } = data;

        return {
            code,
            name,
            menus: this.responseCookingRecipeMenu(cookingRecipeMenus),
            typeDish: this.responseCookingRecipeTypeDish(cookingRecipeTypeDish),
            makeWay: this.responseCookingRecipeMakeWay(cookingRecipeMakeWay),
            image: this.awsService.generateFileUrl(this.awsService.awsCookingRecipeImage, image),
            introduce,
            ingredients: JSON.parse(ingredients),
            ration,
            totalTime,
            instructions: JSON.parse(instructions)
        };
    }

    responseCookingRecipeMenu(menus) {
        if (menus instanceof Array && menus.length > 0) {
            return menus.map((menu) => ({
                id: menu.id,
                name: menu.name
            }));
        }
        return [];
    }

    responseCookingRecipeTypeDish(typeDish) {
        if (!typeDish) return null;

        return {
            id: typeDish.id,
            name: typeDish.name
        };
    }

    responseCookingRecipeMakeWay(makeWay) {
        if (!makeWay) return null;

        return {
            id: makeWay.id,
            name: makeWay.name
        };
    }
}

export default CookingRecipeMapper;
