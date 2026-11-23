// src/fonts.js
export class FontManager {
  constructor(config) {
    this.config = config;
    this.loadedCssUrls = new Set();
    this.loadingCssMap = new Map();
    this.normalizedFonts = this._normalizeAvailableFonts(config.availableFonts || []);
    this.mappingEntries = this._buildMappingLookup(config.fontMapping || {});
  }

  _normalizeAvailableFonts(list) {
    return list.map((item) => {
      if (typeof item === 'string') {
        return { label: item, value: item };
      }
      return {
        label: item.label || item.value,
        value: item.value || item.label
      };
    });
  }

  _buildMappingLookup(rawMap) {
    const map = new Map();
    Object.entries(rawMap).forEach(([rawKey, target]) => {
      if (rawKey && target) {
        map.set(String(rawKey).trim().toLowerCase(), String(target).trim());
      }
    });
    return map;
  }

  getFonts() {
    return this.normalizedFonts;
  }

  getDefaultFont() {
    const def = this.config.defaultFont;
    const matched = this.normalizedFonts.find((f) => f.value === def);
    if (matched) return matched.value;
    return this.normalizedFonts[0]?.value || 'sans-serif';
  }

  /**
   * 将任意字体名通过 fontMapping 归并到统一字体
   */
  resolveMappedFont(fontName) {
    if (!fontName) return this.getDefaultFont();
    const cleaned = String(fontName).replace(/["']/g, '').trim();
    const mapped = this.mappingEntries.get(cleaned.toLowerCase());
    return mapped || cleaned;
  }

  /**
   * 生成 CSS font-family 栈（包含映射后的目标字体及安全回退）
   */
  buildCssFontStack(fontValue) {
    const resolved = this.resolveMappedFont(fontValue);
    const quoteIfNeeded = (name) => {
      const generic = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];
      if (generic.includes(name.toLowerCase())) return name;
      return `"${name.replace(/"/g, '\\"')}"`;
    };
    return `${quoteIfNeeded(resolved)}, "Microsoft YaHei", "PingFang SC", sans-serif`;
  }

  /**
   * 加载单个 CSS 样式表（去重）
   */
  _injectStylesheet(url) {
    if (!url) return Promise.resolve();
    if (this.loadedCssUrls.has(url)) return Promise.resolve();
    if (this.loadingCssMap.has(url)) return this.loadingCssMap.get(url);

    const promise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`link[data-font-css="${CSS.escape(url)}"]`);
      if (existing) {
        this.loadedCssUrls.add(url);
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.dataset.fontCss = url;
      link.onload = () => {
        this.loadedCssUrls.add(url);
        resolve();
      };
      link.onerror = () => {
        reject(new Error(`字体样式加载失败: ${url}`));
      };
      document.head.appendChild(link);
    }).finally(() => {
      this.loadingCssMap.delete(url);
    });

    this.loadingCssMap.set(url, promise);
    return promise;
  }

  /**
   * 加载指定的在线字体配置项（优先 mainCss，失败时尝试 fallbackCss）
   */
  async loadOnlineFontItem(fontItem) {
    if (!fontItem) return;
    if (fontItem.mainCss) {
      try {
        await this._injectStylesheet(fontItem.mainCss);
        return;
      } catch (err) {
        if (fontItem.fallbackCss) {
          await this._injectStylesheet(fontItem.fallbackCss);
          return;
        }
        throw err;
      }
    }
    if (fontItem.fallbackCss) {
      await this._injectStylesheet(fontItem.fallbackCss);
    }
  }

  /**
   * 默认预加载 onlineFonts 前 3 项
   */
  async preloadDefaultOnlineFonts() {
    const onlineFonts = Array.isArray(this.config.onlineFonts) ? this.config.onlineFonts : [];
    const topThree = onlineFonts.slice(0, 3);
    await Promise.allSettled(topThree.map((item) => this.loadOnlineFontItem(item)));
  }

  /**
   * 加载本地字体（若配置了 localFonts）
   */
  async loadLocalFonts() {
    const localFonts = Array.isArray(this.config.localFonts) ? this.config.localFonts : [];
    if (!localFonts.length || typeof FontFace === 'undefined') return;

    const tasks = localFonts.map(async (item) => {
      if (!item.family || !Array.isArray(item.urls) || !item.urls.length) return;
      const src = item.urls.map((u) => `url("${u}")`).join(', ');
      const face = new FontFace(item.family, src, item.descriptors || {});
      await face.load();
      document.fonts.add(face);
    });

    await Promise.allSettled(tasks);
  }

  /**
   * 选中某字体时：先做字体映射，再按需加载对应的在线字体 CSS，并等待 document.fonts 就绪
   */
  async ensureFontReady(selectedFontValue) {
    const mappedName = this.resolveMappedFont(selectedFontValue);
    const onlineFonts = Array.isArray(this.config.onlineFonts) ? this.config.onlineFonts : [];
    const targetItem = onlineFonts.find(
      (f) => f.name === mappedName || f.name === selectedFontValue
    );

    if (targetItem) {
      await this.loadOnlineFontItem(targetItem);
    }

    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (_) {
        // ignore
      }
    }

    return mappedName;
  }

  /**
   * 对 DOCX 渲染 DOM 内的内联/计算字体进行统一映射归并
   */
  applyFontMappingToContainer(containerEl, activeFontValue) {
    if (!containerEl) return;
    const stack = this.buildCssFontStack(activeFontValue);
    containerEl.style.fontFamily = stack;

    // 扫描内部元素，若明确指定了属于 fontMapping 的字体，则统一归并
    const allNodes = containerEl.querySelectorAll('*');
    allNodes.forEach((el) => {
      const inlineFf = el.style && el.style.fontFamily;
      if (inlineFf) {
        const parts = inlineFf.split(',').map((s) => s.replace(/["']/g, '').trim());
        const hasMapped = parts.some((p) => this.mappingEntries.has(p.toLowerCase()));
        if (hasMapped) {
          el.style.fontFamily = stack;
        }
      }
    });
  }
}
