/* =========================================================
 * src/config.js
 * 文本模板图片生成器 · 全局配置
 * ---------------------------------------------------------
 * 配置层级（从低到高）：
 *   1. HARD_DEFAULTS（index.html 内的硬兜底，保命用）
 *   2. freeConfig        自由配置（也是全局兜底层）
 *   3. gridConfig        田字格配置（仅在田字格模式下叠加）
 *   4. lengthPresets     按字数配置（最高优先级）
 *
 * 模式切换：
 *   modes         可选模式列表（默认提供「田字格」/「自由」）
 *   defaultMode   默认模式 key
 * ========================================================= */

const CONFIG = {

    /* =====================================================
     * 1. 界面布局
     * ===================================================== */
    // 面板位置: 'top' | 'bottom' | 'left' | 'right'
    panelPosition: "right",

    // 画布逻辑宽度（固定，导出尺寸不受窗口影响）
    logicalWidth: 1067,


    /* =====================================================
     * 2. 背景图
     * ===================================================== */
    // 默认背景图路径（留空则显示纯色底）
    bgImageUrl: "src/bg01.jpg",

    // 预设背景图列表（模拟文件夹）
    bgImageFolder: [
        "src/bg01.jpg"
    ],


    /* =====================================================
     * 3. 字体
     * ===================================================== */
    // 默认字体
    defaultFont: "方正正中黑简体",

    // 可选字体列表（显示在字体下拉框）
    availableFonts: [
        "方正正中黑简体",
        "得意黑",
        "Microsoft YaHei",
        "SimSun",
        "KaiTi",
        "Arial",
        "sans-serif"
    ],

    // 在线字体加载配置
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


    /* =====================================================
     * 4. 配置模式（新增）
     * -----------------------------------------------------
     * key   ：模式标识（与 freeConfig / gridConfig 无关，仅作为状态值）
     * name  ：按钮上显示的文字
     * 顺序即按钮显示顺序；第一个不用是默认，由 defaultMode 指定。
     * ===================================================== */
    modes: [
        { key: "grid", name: "田字格" },
        { key: "free", name: "自由" }
    ],

    // 默认进入的模式
    defaultMode: "grid",


    /* =====================================================
     * 5. 自由配置（全局兜底层）
     * -----------------------------------------------------
     * 这是最底层的视觉参数，任何模式下都会用到。
     * 田字格配置没写的字段，会自动从这里取。
     * ===================================================== */
    freeConfig: {
        // 颜色
        textColor: "#5586FF",
        lineColor: "#7BAFE8",

        // 文字与排版
        fontSize: 110,
        textRatio: 0.80,
        colGap: 0.0,
        lineGap: 0.0,
        textYOffset: 5,       // 文字垂直微调（格内）
        blockOffsetY: 0,      // 整体上下偏移（画布内）

        // 线条
        borderWidth: 2.5,     // 外框线宽
        dashWidth: 2.5,       // 内虚线宽
        dashDensity: 6,       // 虚线密度

        // 渲染
        resolution: 2,        // 导出精度默认值

        // 换行：每行字数（0 = 不自动换行，完全按输入的回车分行）
        charsPerLine: 0,

        // 样式开关（自由模式默认不带田字格）
        grid: false,
        italic: false,
        bold: false,
        strike: false
    },


    /* =====================================================
     * 6. 田字格配置（叠加层）
     * -----------------------------------------------------
     * 这里的字段会覆盖 freeConfig 中的同名字段。
     * 没写的字段 → 自动沿用 freeConfig。
     * 因此切换模式时，不会因为漏配而丢参数。
     * ===================================================== */
    gridConfig: {
        // 田字格模式下默认开启格子
        grid: true,

        // 字体可以单独指定（不写则用 freeConfig 里的 → 再兜底到硬默认）
        // font: "方正正中黑简体",

        // 线条相关也允许单独覆盖，例如：
        // borderWidth: 2.5,
        // dashWidth: 2.5,
        // dashDensity: 6,
    },


    /* =====================================================
     * 7. 按【字数】的额外配置（最高优先级）
     * -----------------------------------------------------
     * key 的写法（按顺序匹配，精确优先）：
     *     4        → 精确匹配 4 个字
     *     "5-8"    → 5 ~ 8 个字（含两端，也支持 "5~8" / "5至8"）
     *     "9+"     → 9 个字及以上
     *     "1-"     → 1 个字及以下
     *
     * value 可以是【单个对象】或【对象数组】
     *   数组 = 同字数多套方案，界面上会出现切换按钮
     *
     * 每个对象可用字段（未写的字段会依次向
     *   gridConfig → freeConfig → 硬兜底 回溯）：
     *   name            方案名称（显示在切换按钮上）
     *   rows            自动分行：分成几行（每行字数 = ceil(字数 / rows)）
     *   charsPerLine    显式每行字数（优先于 rows；0 表示不自动换行）
     *   fontSize / textRatio / colGap / lineGap / textYOffset / blockOffsetY /
     *   borderWidth / dashWidth / dashDensity / resolution /
     *   font / grid / italic / bold / strike / textColor / lineColor
     * ===================================================== */
    lengthPresets: {
        1: {
            name: "单字",
            rows: 1,
            fontSize: 230,
            textRatio: 0.80,
            blockOffsetY: -45
        },
        2: {
            name: "一行两字",
            rows: 1,
            fontSize: 172,
            textRatio: 0.80,
            textYOffset: -4,
            blockOffsetY: -40
        },
        3: {
            name: "一行三字",
            rows: 1,
            fontSize: 135,
            textRatio: 0.82,
            textYOffset: -4,
            blockOffsetY: -40
        },
        4: {
            name: "一行四字",
            rows: 1,
            fontSize: 135,
            blockOffsetY: -40,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 4
        },
        5: {
            name: "一行五字",
            rows: 1,
            fontSize: 115,
            blockOffsetY: -40,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 4
        },

        // 6 字两套方案：一行6字 / 两行3字
        6: [
            {
                name: "一行六字",
                rows: 1,
                fontSize: 115,
                blockOffsetY: -40,
                borderWidth: 1.5,
                dashWidth: 1.5,
                dashDensity: 4
            },
            {
                name: "两行三字",
                rows: 2,
                fontSize: 95,
                textRatio: 0.79,
                textYOffset: 1,
                blockOffsetY: -45,
                borderWidth: 1.5,
                dashWidth: 1.5,
                dashDensity: 4
            }
        ],

        7: {
            name: "一行七字",
            rows: 1,
            fontSize: 96,
            textRatio: 0.79,
            blockOffsetY: -45,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 4
        },

        // 8~14：双行；奇数时上行比下行多一个字（如 9→5/4，13→7/6）
        "8-14": {
            name: "双行",
            rows: 2,
            fontSize: 95,
            blockOffsetY: -45,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 4
        },

        // 15：三行 5/5/5
        15: {
            name: "三行五字",
            rows: 3,
            fontSize: 97,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 3
        },

        // 16：双行 8/8
        16: {
            name: "双行八字",
            rows: 2,
            fontSize: 96,
            blockOffsetY: -43,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 3
        },

        // 17~21：三行（17→6/6/5，18→6/6/6，19→7/7/5，20→7/7/6，21→7/7/7）
        "17-21": {
            name: "三行",
            rows: 3,
            fontSize: 97,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 3,
            textYOffset: 1
        },

        // 22~24：三行八字（22→8/8/6，23→8/8/7，24→8/8/8）
        "22-24": {
            name: "三行八字",
            rows: 3,
            fontSize: 97,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 2,
            textYOffset: 1
        },

        // 25~27：三行九字（25→9/9/7，26→9/9/8，27→9/9/9）
        "25-27": {
            name: "三行九字",
            rows: 3,
            fontSize: 90,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 2,
            textYOffset: 1
        },

        // 28~30：三行十字（10/10/8）
        "28-30": {
            name: "三行十字",
            rows: 3,
            fontSize: 80,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 2,
            textYOffset: 1
        },

        // 31~40 字兜底
        "31-40": {
            name: "四行",
            rows: 4,
            fontSize: 80,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 2,
            textYOffset: 1
        },

        // 41 字以上兜底
        "41+": {
            name: "五行",
            rows: 5,
            fontSize: 80,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 2,
            textYOffset: 1
        }
    }
};
