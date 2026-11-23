// src/config.js
export const APP_CONFIG = {
  /* ==========================================================
   * 一、基础渲染与导出参数
   * ========================================================== */
  pdfCdnBase: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/',
  pptxGlimpseEsm: 'https://cdn.jsdelivr.net/npm/pptx-glimpse@5.3.1/+esm',
  jszipCdn: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',

  previewWidth: 200,
  lightboxMaxScale: 2,
  maxCanvasSide: 32767,
  maxCanvasArea: 268435456, // 2.68 亿像素上限

  /* ==========================================================
   * 二、字体（针对 DOCX / PPTX 文档内字体的映射与加载）
   * - label：字体显示名称
   * - value：CSS @font-face / 本机字体 / 渲染使用的 font-family
   * - 亦兼容直接写纯字符串（如 "Microsoft YaHei"）
   * ========================================================== */

  // 默认回退字体（需与某个 availableFonts 的 value 匹配）
  defaultFont: 'FZZhengHeiS-DB-GB',

  availableFonts: [
    { label: '方正正中黑简体', value: 'FZZhengHeiS-DB-GB' },
    { label: '方正正中黑_GBK', value: 'FZZhengHei-DB-GBK' },
    { label: '得意黑', value: 'Smiley Sans Oblique' },
    { label: '微软雅黑', value: 'Microsoft YaHei' },
    { label: '宋体', value: 'SimSun' },
    { label: '楷体', value: 'KaiTi' },
    { label: 'Arial', value: 'Arial' },
    { label: '无衬线字体', value: 'sans-serif' }
  ],

  // 在线字体：默认只预加载前 3 项，其余在 DOCX / PPTX 用到该字体时按需加载
  onlineFonts: [
    {
      name: 'FZZhengHeiS-DB-GB',
      mainCss: 'https://sucloudplus.github.io/fonts/fzzhengheis-db-gb/stylesheet.css',
      fallbackCss: ''
    },
    {
      name: 'FZZhengHei-DB-GBK',
      mainCss: 'https://sucloudplus.github.io/fonts/fzzhenghei-db-gbk/stylesheet.css',
      fallbackCss: ''
    },
    {
      name: 'Smiley Sans Oblique',
      mainCss: 'https://fontsapi.zeoseven.com/92/main/result.css',
      fallbackCss: 'https://sucloudplus.github.io/fonts/smiley-sans/stylesheet.css'
    }
  ],

  /* ==========================================================
   * 三、字体统一映射（将多种相近/变体字体归并到统一目标字体）
   * - key：DOCX / PPTX 中声明或用到的原始字体名（不区分大小写）
   * - value：归并后的目标字体名
   * ========================================================== */
  fontMapping: {
    // 多种相近宋体统一归并为 "SimSun"
    '宋体': 'SimSun',
    '新宋体': 'SimSun',
    'NSimSun': 'SimSun',
    'SimSun-ExtB': 'SimSun',
    'STSong': 'SimSun',
    '华文宋体': 'SimSun',
    'Songti SC': 'SimSun',
    'Songti TC': 'SimSun',
    'Noto Serif CJK SC': 'SimSun',

    // 常见雅黑/黑体变体归并
    '微软雅黑': 'Microsoft YaHei',
    'Microsoft YaHei UI': 'Microsoft YaHei',
    'PingFang SC': 'Microsoft YaHei',
    '苹方-简': 'Microsoft YaHei',
    '黑体': 'SimHei',
    'STHeiti': 'SimHei',

    // 常见楷体变体归并
    '楷体': 'KaiTi',
    '楷体_GB2312': 'KaiTi',
    'STKaiti': 'KaiTi',
    '华文楷体': 'KaiTi',
    'Kaiti SC': 'KaiTi'
  },

  /* ==========================================================
   * 四、本地字体（可选：通过 FontFace API 加载本地字体文件）
   * - family：字体族名称
   * - urls：字体文件路径数组（如 ['./assets/fonts/SimSun.woff2']）
   * ========================================================== */
  localFonts: []
};
