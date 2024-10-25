module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
    'simple-import-sort',
    'unused-imports',
    '@typescript-eslint',
  ],
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',

    // import的使用
    'plugin:import/recommended',
    'plugin:import/typescript',

    // @typescript-eslint
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // prettier
    'plugin:prettier/recommended',
  ],
  rules: {
    camelcase: 1,
    'no-shadow': 1,
    'no-param-reassign': 1,
    'no-underscore-dangle': 0, // 允许下划线变量
    'no-unused-vars': 0, // 允许未使用变量,关掉eslint自带的
    'no-unsafe-optional-chaining': 0,
    'no-use-before-define': 0,
    'consistent-return': 0,
    'no-unused-expressions': 0,
    'no-undef': 0,
    'no-lonely-if': 0,
    'prefer-destructuring': 0,

    // simple-import-sort
    'simple-import-sort/imports': 1, // 导入排序
    'simple-import-sort/exports': 1, // 导出排序
    // import
    'import/extensions': 0, // 允许import后缀,比如scss
    'import/no-cycle': 2, // 禁止循环引用
    'import/no-unresolved': 0, // 允许import未定义
    'import/prefer-default-export': 0, // 允许默认导出
    'import/exports-last': 1, // 导出必须放在最后
    'import/no-extraneous-dependencies': 0,
    // unused-imports
    'unused-imports/no-unused-imports': 2, // 禁止未使用的import
    'unused-imports/no-unused-vars': 2, // 禁止未使用的变量
    // react-hooks
    'react-hooks/exhaustive-deps': 1, // 检查hooks依赖'
    'react-hooks/rules-of-hooks': 2, // 检查hooks依赖'

    // react 规则
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'react/no-array-index-key': 1,
    'react/jsx-wrap-multilines': [2, { declaration: false, assignment: false }],
    'react/jsx-filename-extension': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/sort-comp': 0,
    'react/display-name': 0,
    'react/static-property-placement': 0,
    'react/jsx-no-bind': 0, // Should not check test file
    'react/no-find-dom-node': 0,
    'react/no-unused-prop-types': 1,
    'react/default-props-match-prop-types': 0,
    'react/function-component-definition': 0,
    'react/no-unused-class-component-methods': 1,
    'react/destructuring-assignment': 0,
    'react/no-unstable-nested-components': 0,

    // ts规则
    '@typescript-eslint/no-var-requires': 0, // 允许require
    '@typescript-eslint/no-unused-vars': 0, // 关掉ts自带的
    '@typescript-eslint/no-floating-promises': 0, // 允许promise
    '@typescript-eslint/no-unsafe-call': 0, // 允许call
    '@typescript-eslint/no-explicit-any': 0, // 允许any
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-use-before-define': 1,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/ban-ts-comment': 1, // 禁止ts注释
    '@typescript-eslint/no-empty-function': 1, // 禁止空函数
    '@typescript-eslint/ban-types': 0, // 禁止类型
    '@typescript-eslint/no-for-in-array': 0, // 禁止for in
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/no-misused-promises': 0,
    // 保留any的使用，编码时尽量避免
    '@typescript-eslint/no-unsafe-argument': 0, // 允许参数
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    // jsx
    'jsx-a11y/no-static-element-interactions': 0, // 允许静态元素交互
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    // label-has-for has been deprecated
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
    'jsx-a11y/label-has-for': 0,
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.*.json'],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
