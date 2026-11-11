/* ============================================================
 * 文本模板图片生成器 —— 全局配置文件
 * 用法：在 index.html 中通过 <script src="src/config.js"></script> 引入
 *       所有配置挂载到 window.APP_CONFIG
 * ============================================================ */

window.APP_CONFIG = {

    /* ==========================================================
     * 一、界面与资源
     * ========================================================== */

    // 面板位置：'top' | 'bottom' | 'left' | 'right'
    panelPosition: "right",

    // 默认背景图路径（留空则显示纯色）
    bgImageUrl: "src/bg01.jpg",

    // 预设背景图列表（模拟文件夹）
    bgImageFolder: [
        "src/bg01.jpg"
    ],

    // 画布逻辑宽度（固定，导出尺寸不受窗口影响）
    logicalWidth: 1067,

    /* ==========================================================
     * 二、字体
     * ========================================================== */

    // 默认字体（需在 availableFonts 中存在）
    defaultFont: "方正正中黑简体",

    availableFonts: [
        "方正正中黑简体",
        "得意黑",
        "Microsoft YaHei",
        "SimSun",
        "KaiTi",
        "Arial",
        "sans-serif"
    ],

    // 在线字体（自动下载 CSS 并注入）
    onlineFonts: [
        {
            name: "方正正中黑简体",
            mainCss: "https://sucloudplus.github.io/fonts/FZZhengHeiS-DB-GB/stylesheet.css",
            fallbackCss: ""
        },
        {
            name: "得意黑",
            mainCss: "https://fontsapi.zeoseven.com/92/main/result.css",
            fallbackCss: "https://fontsapi-storage.zeoseven.com/92/main/result.css"
        }
    ],

    /* ==========================================================
     * 三、【自由配置】—— 全局兜底参数
     * ----------------------------------------------------------
     * 作用：
     *   1) 页面切换到「自由」模式时，参数完全按本配置生效，
     *      换行完全由回车决定（charsPerLine 无效）。
     *   2) 「田字格」模式下，某个字数方案没有写的字段，
     *      会自动沿用本配置对应字段。
     *   3) 本配置仍未写的字段，使用代码内 FALLBACK_DEFAULTS 兜底。
     * ========================================================== */

    freeConfig: {
        // 颜色
        textColor    : "#5586FF",
        lineColor    : "#7BAFE8",

        // 基础字号与比例
        fontSize     : 110,
        textRatio    : 0.80,

        // 间距（px）
        colGap       : 0,
        lineGap      : 0,

        // 微调（px）
        textYOffset  : 5,      // 文字在格子内的垂直微调
        blockOffsetY : 0,      // 整体在画布内的上下偏移

        // 线条
        borderWidth  : 2.5,    // 外框线宽
        dashWidth    : 2.5,    // 内虚线宽
        dashDensity  : 6,      // 虚线密度

        // 导出
        resolution   : 2,      // 导出清晰度倍率

        // 样式开关
        grid         : true,   // 田字格
        italic       : false,
        bold         : false,
        strike       : false,

        // 字体（留空则使用下拉框默认项）
        font         : "方正正中黑简体"
    },

    /* ==========================================================
     * 四、【田字格配置】—— 按字数匹配的专用方案
     * ----------------------------------------------------------
     * key 的写法（按顺序匹配，精确优先）：
     *     4        → 精确匹配 4 个字
     *     "5-8"    → 5 ~ 8 个字（含两端，也支持 "5~8" / "5至8"）
     *     "9+"     → 9 个字及以上
     *     "1-"     → 1 个字及以下
     *
     * value 可以是【单个对象】或【对象数组】：
     *   - 数组 = 同一字数下的多套方案，可在页面按钮上切换
     *
     * 每个对象可用字段（未写的 → 自由配置兜底）：
     *   name            方案名称（显示在切换按钮上）
     *   rows            自动分行：分成几行（每行字数 = ceil(字数 / rows)）
     *   charsPerLine    显式每行字数（优先于 rows；0 表示不自动换行）
     *   fontSize / textRatio / colGap / lineGap / textYOffset / blockOffsetY /
     *   borderWidth / dashWidth / dashDensity / resolution /
     *   font / grid / italic / bold / strike / textColor / lineColor
     * ========================================================== */

    gridConfig: {
        lengthPresets: {

            // ---------- 单行短句 ----------
            1 : { name: "单字",       rows: 1, fontSize: 230, textRatio: 0.80, blockOffsetY: -45 },
            2 : { name: "一行两字",   rows: 1, fontSize: 172, textRatio: 0.80, textYOffset: -4, blockOffsetY: -40 },
            3 : { name: "一行三字",   rows: 1, fontSize: 135, textRatio: 0.82, textYOffset: -4, blockOffsetY: -40 },

            4 : { name: "一行四字",   rows: 1, fontSize: 135, blockOffsetY: -40,
                  borderWidth: 1.5, dashWidth: 1.5, dashDensity: 4 },
            5 : { name: "一行五字",   rows: 1, fontSize: 115, blockOffsetY: -40,
                  borderWidth: 1.5, dashWidth: 1.5, dashDensity: 4 },

            // 6 字两套方案
            6 : [
                { name: "一行六字", rows: 1, fontSize: 115, blockOffsetY: -40,
                  borderWidth: 1.5, dashWidth: 1.5, dashDensity: 4 },
                { name: "两行三字", rows: 2, fontSize: 95, textRatio: 0.79, textYOffset: 1, blockOffsetY: -45,
                  borderWidth: 1.5, dashWidth: 1.5, dashDensity: 4 }
            ],

            7 : { name: "一行七字",   rows: 1, fontSize: 96, textRatio: 0.79, blockOffsetY: -45,
                  borderWidth: 1.5, dashWidth: 1.5, dashDensity: 4 },

            // ---------- 双行 ----------
            // 8~14：双行；奇数时上行比下行多一个字（如 9→5/4，13→7/6）
            "8-14": { name: "双行", rows: 2, fontSize: 95, blockOffsetY: -45,
                      borderWidth: 1.5, dashWidth: 1.5, dashDensity: 4 },

            // ---------- 三行 ----------
            15 : { name: "三行五字", rows: 3, fontSize: 97, blockOffsetY: 17,
                   borderWidth: 1.5, dashWidth: 1.5, dashDensity: 3 },

            16 : { name: "双行八字", rows: 2, fontSize: 96, blockOffsetY: -43,
                   borderWidth: 1.5, dashWidth: 1.5, dashDensity: 3 },

            // 17~21：三行（17→6/6/5，18→6/6/6，19→7/7/5，20→7/7/6，21→7/7/7）
            "17-21": { name: "三行", rows: 3, fontSize: 97, blockOffsetY: 17,
                       borderWidth: 1.5, dashWidth: 1.5, dashDensity: 3, textYOffset: 1 },

            // 22~24：三行八字（22→8/8/6，23→8/8/7，24→8/8/8）
            "22-24": { name: "三行八字", rows: 3, fontSize: 97, blockOffsetY: 17,
                       borderWidth: 1.5, dashWidth: 1.5, dashDensity: 2, textYOffset: 1 },

            // 25~27：三行九字（25→9/9/7，26→9/9/8，27→9/9/9）
            "25-27": { name: "三行九字", rows: 3, fontSize: 90, blockOffsetY: 17,
                       borderWidth: 1.5, dashWidth: 1.5, dashDensity: 2, textYOffset: 1 },

            // 28~30：三行十字（10/10/8）
            "28-30": { name: "三行十字", rows: 3, fontSize: 80, blockOffsetY: 17,
                       borderWidth: 1.5, dashWidth: 1.5, dashDensity: 2, textYOffset: 1 },

            // ---------- 多行兜底 ----------
            "31-40": { name: "四行", rows: 4, fontSize: 80, blockOffsetY: 17,
                       borderWidth: 1.5, dashWidth: 1.5, dashDensity: 2, textYOffset: 1 },

            "41+":   { name: "五行", rows: 5, fontSize: 80, blockOffsetY: 17,
                       borderWidth: 1.5, dashWidth: 1.5, dashDensity: 2, textYOffset: 1 }
        }
    }
};
