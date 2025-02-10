import { sequelize } from '../helpers/database';
import { DataTypes } from 'sequelize';
import Constants from '../utils/Constants';
import User from './user';

const Token = sequelize.define('tokens', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
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

Token.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id'
});

export default Token;
