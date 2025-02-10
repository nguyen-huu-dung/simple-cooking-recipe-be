import { sequelize } from '../helpers/database';
import { DataTypes } from 'sequelize';
import Constants from '../utils/Constants';

const CookingRecipeMakeWay = sequelize.define('cooking_recipe_make_ways', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
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

export default CookingRecipeMakeWay;
