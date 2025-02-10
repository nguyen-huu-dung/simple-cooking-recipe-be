class Constants {

    // #region common
    LANGUAGE = {
        vi: 'vi'
    };

    STATUS = {
        ACTIVE: 1,
        INACTIVE: 2
    };

    DELETE_FLAG = {
        NOT_DELETE: 0,
        DELETED: 1
    };

    SORT_DEFAULT = {
        SORT_KEY: 'created_at',
        SORT_DIR: 'DESC'
    };

    SORT_DIR_TYPE = {
        DESC: 'DESC',
        ASC: 'ASC'
    };

    ALPHABET_GENERATE_UUID = {
        ALPHABET_NUMBER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
        ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        NUMBER: '1234567890',
        LOW_ALPHABET: 'abcdefghijklmnopqrstuvwxyz',
        LOW_ALPHABET_NUMBER: 'abcdefghijklmnopqrstuvwxyz1234567890',
        UPPER_ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        UPPER_ALPHABET_NUMBER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    };

    MAX_LENGTH_DEFAULT = {
        INPUT: 255,
        TEXTAREA: 5000
    };

    // #region

    // #region model

    CODE_MODEL = {
        USER: {
            FIRST_CODE: 'u'
        },
        COOKING_RECIPE: {
            FIRST_CODE: 'cr'
        }
    };
    // #endregion

    // #region user
    GENDER = {
        MALE: 1,
        FEMALE: 2
    };

    // #endregion
}

export default new Constants();
