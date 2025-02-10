import { sequelize } from '../helpers/database';
import { DataTypes } from 'sequelize';
import Constants from '../utils/Constants';
import CookingRecipeTypeDish from './cookingRecipeTypeDish';
import CookingRecipeMakeWay from './cookingRecipeMakeWay';
import User from './user';

const CookingRecipe = sequelize.define('cooking_recipes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    introduce: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type_dish: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    make_way: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING
    },
    ingredients: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    ration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    instructions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    create_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    delete_flag: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: Constants.DELETE_FLAG.NOT_DELETE
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

CookingRecipe.belongsTo(CookingRecipeTypeDish, {
    foreignKey: 'type_dish',
    targetKey: 'id'
});

CookingRecipe.belongsTo(CookingRecipeMakeWay, {
    foreignKey: 'make_way',
    targetKey: 'id'
});

CookingRecipe.belongsTo(User, {
    foreignKey: 'create_by',
    targetKey: 'id'
});

export default CookingRecipe;
