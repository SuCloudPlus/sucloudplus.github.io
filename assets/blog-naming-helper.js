/**
 * 博客文件名助手 - 格式：YYYYMMDDHHmmssSSS-[Base62编码标题].md
 */
const BlogNamingHelper = (function() {
    const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // 内部方法：字符串转 Base62
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

    // 内部方法：Base62 转字符串
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
        /**
         * 生成精确到毫秒的文件名
         * @param {string} title 标题
         * @returns {string} 20240321131430627-xxxx.md
         */
        formatFileName(title) {
            const now = new Date();
            
            // 构建精确时间戳：YYYYMMDDHHmmssSSS
            const dateStr = now.getFullYear().toString() +
                            (now.getMonth() + 1).toString().padStart(2, '0') +
                            now.getDate().toString().padStart(2, '0') +
                            now.getHours().toString().padStart(2, '0') +
                            now.getMinutes().toString().padStart(2, '0') +
                            now.getSeconds().toString().padStart(2, '0') +
                            now.getMilliseconds().toString().padStart(3, '0');
            
            const encodedTitle = _toBase62(title);
            return `${dateStr}-${encodedTitle}.md`;
        },

        /**
         * 从文件名解析出精确时间和标题
         * @param {string} fileName 
         * @returns {object} {rawTime, title, formattedTime}
         */
        parseFileName(fileName) {
            const pureName = fileName.replace(/\.md$/, '');
            const firstDashIndex = pureName.indexOf('-');
            
            if (firstDashIndex === -1) {
                return { rawTime: "", title: pureName };
            }

            const rawTime = pureName.substring(0, firstDashIndex);
            const encodedPart = pureName.substring(firstDashIndex + 1);
            
            // 尝试格式化时间以便显示：2024-03-21 13:14:30
            let formattedTime = rawTime;
            if (rawTime.length >= 14) {
                formattedTime = `${rawTime.substring(0,4)}-${rawTime.substring(4,6)}-${rawTime.substring(6,8)} ` +
                                `${rawTime.substring(8,10)}:${rawTime.substring(10,12)}:${rawTime.substring(12,14)}`;
            }
            
            return {
                rawTime: rawTime,
                formattedTime: formattedTime,
                title: _fromBase62(encodedPart)
            };
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = BlogNamingHelper;