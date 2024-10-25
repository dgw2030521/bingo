module.exports = {
  plugins: {
    autoprefixer: {}, // 用来给不同的浏览器自动添加相应前缀，如-webkit-，-moz-等等
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 750, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换,@media，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false, // 是否处理横屏情况
    },
    // 用来处理元素的宽高比
    'postcss-aspect-ratio-mini': {},
    // 直接在css中写svg，可用来解决1px问题，用了postcss-px-to-viewport-8-plugin之后可以不用这个svg的方式了
    // 将svg文件转换为css中的data URI，并省略引用svg文件的步骤，减少网络请求
    'postcss-write-svg': {
      utf8: false,
    },
  },
};
