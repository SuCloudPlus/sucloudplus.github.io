/**
 * 博客文件名助手 - 格式：YYYYMMDDHHmmssSSS-[Base62编码内容].md
 */
const BlogNamingHelper = (function() {
    const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // 字符串转 Base62
    function _toBase62(text) {
        if (!text) return "";
        const bytes = new TextEncoder().encode(text);
        let hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        let num = BigInt("0x" + hex);
        if (num === 0n) return CHARSET[0];
        let res = "";
        while (num > 0n) {
            res = CHARSET[Number(num % 62n)] + res;
            num = num / 62n;
        }
        return res;
    }

    // Base62 转字符串
    function _fromBase62(b62) {
        if (!b62) return "";
        let num = 0n;
        for (let char of b62) {
            const index = CHARSET.indexOf(char);
            if (index === -1) return "[编码错误]"; 
            num = num * 62n + BigInt(index);
        }
        let hex = num.toString(16);
        if (hex.length % 2 !== 0) hex = '0' + hex;
        try {
            const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            return new TextDecoder().decode(bytes);
        } catch (e) {
            return "[解码失败]";
        }
    }

    return {
        encodeBase62(text) { return _toBase62(text); },
        decodeBase62(b62) { return _fromBase62(b62); },

        /**
         * 合成文件名
         * @param {string} id 原始时间戳前缀
         * @param {string} encodedTitle 已经是 Base62 编码后的标题串
         */
        formatFileName(id, encodedTitle) {
            const timestamp = id || new Date().toISOString().replace(/[-T:Z.]/g, "").substring(0, 17);
            return `${timestamp}-${encodedTitle}.md`;
        },

        /**
         * 解析文件名
         */
        parseFileName(fileName) {
            const pureName = fileName.replace(/\.md$/, '');
            const firstDashIndex = pureName.indexOf('-');
            
            if (firstDashIndex === -1) {
                return { rawTime: "", title: pureName };
            }

            const rawTime = pureName.substring(0, firstDashIndex);
            const encodedPart = pureName.substring(firstDashIndex + 1);
            
            // 尝试格式化时间显示
            let formattedTime = rawTime;
            if (rawTime.length >= 14) {
                formattedTime = `${rawTime.substring(0,4)}-${rawTime.substring(4,6)}-${rawTime.substring(6,8)} ` +
                                `${rawTime.substring(8,10)}:${rawTime.substring(10,12)}:${rawTime.substring(12,14)}`;
            }
            
            return {
                rawTime: rawTime,
                formattedTime: formattedTime,
                // 这里返回的是 _fromBase62 后的字符串
                // 如果是私有文章，这个字符串依然是加密的 Base64，需要进一步 Crypto 解密
                title: _fromBase62(encodedPart)
            };
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = BlogNamingHelper;
