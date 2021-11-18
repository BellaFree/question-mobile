module.exports = {
  root: true,
  globals: {
    AMap: true,
    AMapUI: true
  },
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 句末分号
    'semi':['error', 'always'],
    'semi-style': ['error', 'last'],
    // 禁用不必要的分号
    'no-extra-semi': 'error',
    'no-unreachable': 'off',
    // 禁止未使用过的变量
    'no-unused-vars': ['error', { args: 'none' }],
    // 禁止属性前有空白
    'no-whitespace-before-property': 'error',
    // 禁止可以表达为更简单结构的三元操作符
    'no-unneeded-ternary': 'error',
    // 强制在 JSX 属性中使用一致的单引号或双引号
    'jsx-quotes': ['error'],
    // 强制使用一致的缩进
    'indent': ['error', 2, {
      // (默认：0) 强制 switch 语句中的 case 子句的缩进级别
      SwitchCase: 1,
      //  (默认 false) 要求三元表达式内的三元表达式不能有缩进。
      flatTernaryExpressions: true,
      VariableDeclarator: 'first'
    }],
    'object-curly-newline': ['error', {
      multiline: true,
      minProperties: 0
    }],
    // 禁止冗余的括号
    'no-extra-parens': 'error',
    // 要求遵循大括号约定
    'curly': 'error',
    // 强制在代码块中使用一致的大括号风格
    'brace-style': 'error',
    // 逗号样式
    'comma-style': ['error', 'last'],
    // 禁止或强制在括号内使用空格
    'array-bracket-spacing': ['error', 'always', { singleValue: false }],
    // 要求或禁止在函数标识符和其调用之间有空格
    'func-call-spacing': ['error', 'never'],
    // 强制关键字周围空格的一致性
    'keyword-spacing': ['error', {
      before: true,
      after: true
    }],
    // 禁止或强制在代码块中开括号前和闭括号后有空格
    'block-spacing': ['error', 'always'],
    // 强制在花括号中使用一致的空格
    'object-curly-spacing': ['error', 'always'],
    // [] {}里面逗号后空格
    'comma-spacing': ['error', { before: false, after: true }],
    // 强制分号前后有空格
    'semi-spacing': 'error',
    // 要求或禁止语句块之前的空格
    'space-before-blocks': 'error',
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    // 禁止或强制圆括号内的空格
    'space-in-parens': ['error', 'never'],
    // 要求中缀操作符周围有空格
    'space-infix-ops': ['error'],
    // 要求或禁止在注释前有空白
    'spaced-comment': ['error', 'always', {
      line: {
        markers: ['/'],
        exceptions: ['-', '+']
      },
      block: {
        markers: ['!'],
        exceptions: ['*'],
        balanced: true
      }
    }],
    // 强制在 switch 的冒号左右有空格
    'switch-colon-spacing': ['error', { after: true, before: false }],
    // 箭头函数空格
    'arrow-spacing': 'error',
    // 强制剩余和扩展运算符及其表达式之间有空格
    'rest-spread-spacing': ['error', 'never'],
    // 强制模板字符串中空格的使用
    'template-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'quote-props':['error', 'consistent-as-needed']
  }
}
