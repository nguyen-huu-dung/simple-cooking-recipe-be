import { Model } from 'sequelize';
import Constants from '../utils/Constants';
import { sequelize } from '../helpers/database';

class BaseRepository {

    constructor() {
        this.model = Model;
        this.constants = Constants;
    }

    // create
    create(data, { transaction } = {}) {
        return this.model.create(data, {
            transaction
        });
    }

    // create list
    createList(data, { transaction } = {}) {
        return this.model.bulkCreate(data, {
            transaction
        });
    }

    // update
    async update({ options, data }, { transaction } = {}) {
        let result = {};
        const dataUpdate = await this.model.update(data, {
            where: options,
            transaction
        });
        if (dataUpdate?.length > 2) {
            result = dataUpdate[1];
        }
        return result;
    }

    updateList(data, { feilds, transaction } = {}) {
        return this.model.bulkCreate(data, {
            transaction,
            updateOnDuplicate: feilds
        });
    }

    // upsert
    upsert(data, { transaction } = {}) {
        return this.model.upsert(data, {
            transaction
        });
    }

    // delete
    delete(options, { transaction } = {}) {
        return this.model.destroy({
            where: options,
            transaction
        });
    }

    deleteByFlag(options, { transaction } = {}) {
        return this.update({
            options,
            data: {
                delete_flag: this.constants.DELETE_FLAG.DELETED
            }
        }, {
            transaction
        });
    }

    // get
    addListOrderBy(order, disabledOrderDefault = false) {
        const listOrderBy = [];
        // list sort
        if (order) {
            if (Array.isArray(order)) {
                order.forEach((o) => {
                    listOrderBy.push([o.sortKey, o.sortDir]);
                });
            } else {
                listOrderBy.push([order.sortKey, order.sortDir]);
            }
        }
        if (!disabledOrderDefault) {
            listOrderBy.push([this.constants.SORT_DEFAULT.SORT_KEY, this.constants.SORT_DEFAULT.SORT_DIR]);
        }

        return listOrderBy;
    }

    findOne(options, { includes, orders, searchAll, transaction, attributes } = {}) {
        return this.model.findOne({
            where: {
                ...options,
                ...!searchAll ?
                    {
                        delete_flag: this.constants.DELETE_FLAG.NOT_DELETE
                    } :
                    {}
            },
            ...includes?.length ?
                {
                    include: includes
                } :
                {},
            ...attributes ?
                {
                    attributes
                } :
                {},
            order: this.addListOrderBy(orders),
            transaction
        });
    }

    findAll(options, { includes, orders, searchAll, transaction, isRawObject, attributes, group, disabledOrderDefault, having, limit } = {}) {
        return this.model.findAll({
            ...isRawObject ?
                {
                    raw: true,
                    nest: true
                } :
                {},
            where: {
                ...options,
                ...!searchAll ?
                    {
                        delete_flag: this.constants.DELETE_FLAG.NOT_DELETE
                    } :
                    {}
            },
            ...includes?.length ?
                {
                    include: includes
                } :
                {},
            ...group ?
                {
                    group
                } :
                {},
            ...attributes ?
                {
                    attributes
                } :
                {},
            order: this.addListOrderBy(orders, disabledOrderDefault),
            ...having ?
                {
                    having
                } :
                {},
            limit,
            transaction
        });
    }

    getCount({
        optionAll,
        includes,
        group,
        attributes,
        col,
        distinct
    }, { transaction } = {}) {
        return this.model.count({
            where: optionAll,
            ...includes?.length ?
                {
                    include: includes
                } :
                {},
            ...group ?
                {
                    group
                } :
                {},
            ...attributes ?
                {
                    attributes
                } :
                {},
            col,
            distinct,
            transaction
        });
    }

    async paginate({
        options,
        limit, page,
        includes,
        orders,
        attributes,
        group,
        transaction,
        isRawObject,
        searchAll,
        isShuffle,
        having,
        disabledOrderDefault,
        distinct
    } = {}) {
        const optionAll = {
            ...options,
            ...!searchAll ?
                {
                    delete_flag: this.constants.DELETE_FLAG.NOT_DELETE
                } :
                {}
        };
        const count = await this.getCount({
            optionAll,
            includes,
            group
        }, transaction);
        const perPage = limit && parseInt(limit) > 0 ? parseInt(limit) : count;
        let currentPage = page && parseInt(page) > 0 ? parseInt(page) : 1;
        const totalPage = perPage !== 0 ? Math.ceil(count / perPage) : 0;
        currentPage = currentPage > totalPage && totalPage > 0 ? totalPage : currentPage;
        const skip = (currentPage - 1) * perPage;

        const elements = await this.model.findAll({
            ...attributes ?
                {
                    attributes
                } :
                {},
            ...group ?
                {
                    group
                } :
                {},
            ...having ?
                {
                    having
                } :
                {},
            ...isRawObject ?
                {
                    raw: true,
                    nest: true
                } :
                {},
            where: optionAll,
            ...includes?.length ?
                {
                    include: includes
                } :
                {},
            order: isShuffle ? sequelize.random() : this.addListOrderBy(orders, disabledOrderDefault),
            limit: perPage,
            offset: skip,
            transaction
        });

        return {
            elements: elements,
            pagination: {
                page: parseInt(currentPage),
                size: perPage,
                totalPage,
                totalRecord: count
            }
        };
    }

    // return model instance
    getModel() {
        return this.model;
    }
}

export default BaseRepository;
