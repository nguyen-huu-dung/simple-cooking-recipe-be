module.exports = {
    'env': {
        'node': true,
        'es6': true
    },
    'extends': ['plugin:@stylistic/js/all-extends'],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': ['@stylistic/js'],
    'rules': {
        'no-unused-vars': 'warn',
        'no-plusplus': [
            'error',
            {
                'allowForLoopAfterthoughts': true
            }
        ],
        '@stylistic/js/max-len': [
            'error',
            {
                'code': 200
            }
        ],
        '@stylistic/js/object-curly-newline': [
            'error',
            {
                'ObjectExpression': {
                    'multiline': true,
                    'minProperties': 1
                },
                'ObjectPattern': {
                    'multiline': true
                },
                'ImportDeclaration': 'never',
                'ExportDeclaration': {
                    'multiline': true,
                    'minProperties': 3
                }
            }
        ],
        '@stylistic/js/array-bracket-newline': [
            'error',
            {
                'multiline': true,
                'minItems': 3
            }
        ],
        '@stylistic/js/array-element-newline': [
            'error',
            {
                'multiline': true,
                'minItems': 3
            }
        ],
        '@stylistic/js/object-curly-spacing': ['error', 'always'],
        '@stylistic/js/semi': ['error', 'always'],
        '@stylistic/js/indent': ['error', 4],
        '@stylistic/js/comma-dangle': ['warn', 'never'],
        '@stylistic/js/quotes': ['error', 'single'],
        '@stylistic/js/quote-props': ['warn', 'consistent'],
        '@stylistic/js/operator-linebreak': ['error', 'after'],
        '@stylistic/js/function-paren-newline': ['error', 'multiline-arguments'],
        '@stylistic/js/brace-style': ['error', '1tbs'],
        '@stylistic/js/linebreak-style': ['error', 'windows'],
        '@stylistic/js/multiline-ternary': ['error', 'always-multiline'],
        '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
        '@stylistic/js/padded-blocks': 'off',
        '@stylistic/js/eol-last': ['error', 'always'],
        '@stylistic/js/no-multiple-empty-lines': [
            'error',
            {
                'max': 1
            }
        ],
        '@stylistic/js/newline-per-chained-call': [
            'error',
            {
                'ignoreChainWithDepth': 5
            }
        ],
        '@stylistic/js/space-before-function-paren': [
            'error',
            {
                'anonymous': 'always',
                'named': 'never',
                'asyncArrow': 'always'
            }
        ],
        '@stylistic/js/multiline-comment-style': 'off',
        '@stylistic/js/no-extra-parens': [
            'error',
            'all',
            {
                'nestedBinaryExpressions': false
            }
        ]
    }
};
