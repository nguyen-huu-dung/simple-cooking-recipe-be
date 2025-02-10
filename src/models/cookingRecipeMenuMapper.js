import { sequelize } from '../helpers/database';
import { DataTypes } from 'sequelize';
import CookingRecipe from './cookingRecipe';
import CookingRecipeMenu from './cookingRecipeMenu';

const CookingRecipeMenuMapper = sequelize.define('cooking_recipes_menus_mapper', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cooking_recipe_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

CookingRecipe.belongsToMany(CookingRecipeMenu, {
    through: CookingRecipeMenuMapper,
    foreignKey: 'cooking_recipe_id'
});

CookingRecipeMenu.belongsToMany(CookingRecipe, {
    through: CookingRecipeMenuMapper,
    foreignKey: 'menu_id'
});

export default CookingRecipeMenuMapper;
