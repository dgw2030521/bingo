module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    'postcss-aspect-ratio-mini': {},
    'postcss-write-svg': {
      utf8: false,
    },
    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 1920, // UI设计稿的宽度
      unitPrecision: 5, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ['.wrap', '.ignore', '.hairlines'], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      // 媒体查询里的单位是否需要转换单位
      mediaQuery: false,
      replace: true, // 是否转换后直接更换属性值
      // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
      exclude: [/node_modules/, /dist/, /.output/, /.nuxt/, /.vscode/],
      // 如果设置了include，那将只有匹配到的文件才会被转换
      // include: [/pages/, /assets\/styles\/*/],

      // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
      landscape: false,
      // 横屏时使用的单位
      landscapeUnit: 'vw',
      // 横屏时使用的视口宽度
      landscapeWidth: 1338,
    },
    'postcss-viewport-units': {}, // 给vw、vh、vmin和vmax做适配的操作,这是实现vw布局必不可少的一个插件
    // 根据目标浏览器的兼容性要求，自动引入所需的Polyfill，提升代码的兼容性。
    'postcss-preset-env': {
      browsers: 'last 2 versions', // 指定只对最近 2 个版本的浏览器进行兼容性处理。
    },
    cssnano: {
      // 主要用来压缩和清理CSS代码。在Webpack中，cssnano和css-loader捆绑在一起，所以不需要自己加载它。
      preset: 'advanced', // 重复调用
      autoprefixer: false, // cssnext和cssnano都具有autoprefixer,事实上只需要一个，所以把默认的autoprefixer删除掉，然后把cssnano中的autoprefixer设置为false。
      'postcss-zindex': false, // 只要启用了这个插件，z-index的值就会重置为1
    },
  },
};
