/* =========================================================
 * src/config.js
 * 文本模板图片生成器 · 全局配置
 * ---------------------------------------------------------
 * 配置优先级（从高到低）：
 *   1. lengthPresets   字数方案（同字数可多套，可切换）
 *   2. gridConfig      田字格模式专属（仅 grid 模式叠加）
 *   3. freeConfig      自由配置（全局兜底）
 *   4. HARD_DEFAULTS   index.html 内的硬兜底
 *
 * 模式切换只影响 gridConfig 是否叠加，
 * 字数方案中的参数永远优先，切换模式不会丢失字数配置。
 * ========================================================= */

const CONFIG = {

    /* =====================================================
     * 1. 界面布局
     * ===================================================== */
    panelPosition: "right",   // 'top' | 'bottom' | 'left' | 'right'
    logicalWidth: 1067,       // 画布逻辑宽度（固定）

    /* =====================================================
     * 2. 背景图
     * ===================================================== */
    bgImageUrl: "src/bg01.jpg",
    bgImageFolder: [
        "src/bg01.jpg"
    ],

    /* =====================================================
     * 3. 字体
     * ===================================================== */
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
     * 4. 配置模式
     * -----------------------------------------------------
     * 切换模式时：字数方案参数仍然优先，
     *   模式配置只负责「字数方案没写的字段」的兜底。
     * ===================================================== */
    modes: [
        { key: "grid", name: "田字格" },
        { key: "free", name: "自由" }
    ],

    defaultMode: "grid",

    /* =====================================================
     * 5. 自由配置（全局兜底层）
     * ===================================================== */
    freeConfig: {
        textColor: "#5586FF",
        lineColor: "#7BAFE8",

        fontSize: 110,
        textRatio: 0.80,
        colGap: 0.0,
        lineGap: 0.0,
        textYOffset: 5,
        blockOffsetY: 0,

        borderWidth: 2.5,
        dashWidth: 2.5,
        dashDensity: 6,
        resolution: 2,

        charsPerLine: 0,

        // 自由模式默认不显示格子
        grid: false,
        italic: false,
        bold: false,
        strike: false
    },

    /* =====================================================
     * 6. 田字格配置（叠加层）
     * -----------------------------------------------------
     * 只写与自由配置不同的字段，其余自动沿用 freeConfig。
     * 字数方案中出现的字段仍然优先于这里。
     * ===================================================== */
    gridConfig: {
        grid: true
        // 如需让田字格模式单独使用别的字体/线宽，可在此补充：
        // font: "方正正中黑简体",
        // borderWidth: 2.5,
        // dashWidth: 2.5,
        // dashDensity: 6,
    },

    /* =====================================================
     * 7. 按【字数】的额外配置（最高优先级）
     * -----------------------------------------------------
     * key 写法：
     *   4        → 精确 4 个字
     *   "5-8"    → 5~8 个字（支持 "5~8" / "5至8"）
     *   "9+"     → 9 个字及以上
     *   "1-"     → 1 个字及以下
     *
     * value 可以是单个对象，或对象数组（同字数多套方案）。
     * 未写的字段 → gridConfig（田字格模式）/ freeConfig → 硬兜底。
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

        "8-14": {
            name: "双行",
            rows: 2,
            fontSize: 95,
            blockOffsetY: -45,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 4
        },

        15: {
            name: "三行五字",
            rows: 3,
            fontSize: 97,
            blockOffsetY: 17,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 3
        },
        16: {
            name: "双行八字",
            rows: 2,
            fontSize: 96,
            blockOffsetY: -43,
            borderWidth: 1.5,
            dashWidth: 1.5,
            dashDensity: 3
        },

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
