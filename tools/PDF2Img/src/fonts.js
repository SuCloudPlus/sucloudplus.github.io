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

  getDefaultFont() {
    const def = this.config.defaultFont;
    const matched = this.normalizedFonts.find((f) => f.value === def);
    if (matched) return matched.value;
    return this.normalizedFonts[0]?.value || 'sans-serif';
  }

  /**
   * 清洗字体名并执行统一映射（如将多种宋体归并为 SimSun）
   */
  resolveMappedFont(rawFontName) {
    if (!rawFontName) return null;
    const cleaned = String(rawFontName).replace(/["']/g, '').trim();
    if (!cleaned) return null;
    const mapped = this.mappingEntries.get(cleaned.toLowerCase());
    return mapped || cleaned;
  }

  /**
   * 为指定字体生成 CSS font-family 栈
   */
  buildFontStack(primaryFont, fallbackFont = null) {
    const resolvedPrimary = this.resolveMappedFont(primaryFont);
    const resolvedFallback = this.resolveMappedFont(fallbackFont) || this.getDefaultFont();
    const quote = (name) => {
      const generic = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];
      if (generic.includes(name.toLowerCase())) return name;
      return `"${name.replace(/"/g, '\\"')}"`;
    };

    const parts = [];
    if (resolvedPrimary) parts.push(quote(resolvedPrimary));
    if (resolvedFallback && resolvedFallback !== resolvedPrimary) {
      parts.push(quote(resolvedFallback));
    }
    parts.push('"Microsoft YaHei"', '"PingFang SC"', 'sans-serif');
    return parts.join(', ');
  }

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
   * 加载本地字体（通过 FontFace API）
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
   * 按需加载单个字体名称对应的在线样式表
   */
  async ensureFontLoadedByName(fontName) {
    const resolved = this.resolveMappedFont(fontName);
    if (!resolved) return;

    const onlineFonts = Array.isArray(this.config.onlineFonts) ? this.config.onlineFonts : [];
    const matched = onlineFonts.find(
      (item) => item.name === resolved || item.name === fontName
    );
    if (matched) {
      await this.loadOnlineFontItem(matched);
    }
  }

  /**
   * 扫描 DOCX 渲染容器中的字体，完成映射归并并按需加载对应字体
   */
  async prepareDocxFonts(containerEl) {
    if (!containerEl) return;
    const candidateFonts = new Set([this.getDefaultFont()]);

    const nodes = containerEl.querySelectorAll('*');
    nodes.forEach((el) => {
      const ff = el.style && el.style.fontFamily;
      if (!ff) return;
      const firstToken = ff.split(',')[0].replace(/["']/g, '').trim();
      if (!firstToken) return;
      const mapped = this.resolveMappedFont(firstToken);
      if (mapped) {
        candidateFonts.add(mapped);
        el.style.fontFamily = this.buildFontStack(mapped, this.getDefaultFont());
      }
    });

    await Promise.allSettled(
      Array.from(candidateFonts).map((name) => this.ensureFontLoadedByName(name))
    );

    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) { /* ignore */ }
    }
  }

  /**
   * 扫描 PPTX SVG 中的字体，完成映射归并并按需加载对应字体
   */
  async preparePptxFonts(svgStr) {
    const candidateFonts = new Set([this.getDefaultFont()]);
    let serialized = svgStr;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgStr, 'image/svg+xml');
      const svgEl = doc.documentElement;

      const rootFf = svgEl.getAttribute('font-family');
      if (rootFf) {
        const mappedRoot = this.resolveMappedFont(rootFf.split(',')[0]);
        if (mappedRoot) {
          candidateFonts.add(mappedRoot);
          svgEl.setAttribute('font-family', this.buildFontStack(mappedRoot, this.getDefaultFont()));
        }
      }

      doc.querySelectorAll('[font-family]').forEach((node) => {
        const raw = node.getAttribute('font-family');
        const mapped = this.resolveMappedFont(raw.split(',')[0]);
        if (mapped) {
          candidateFonts.add(mapped);
          node.setAttribute('font-family', this.buildFontStack(mapped, this.getDefaultFont()));
        }
      });

      serialized = new XMLSerializer().serializeToString(doc);
    } catch (_) {
      serialized = svgStr;
    }

    await Promise.allSettled(
      Array.from(candidateFonts).map((name) => this.ensureFontLoadedByName(name))
    );

    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (_) { /* ignore */ }
    }

    return serialized;
  }
}
