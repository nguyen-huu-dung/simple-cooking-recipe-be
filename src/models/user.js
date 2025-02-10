import { sequelize } from '../helpers/database';
import { DataTypes } from 'sequelize';
import Constants from '../utils/Constants';

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
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

export default User;
