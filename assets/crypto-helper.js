/**
 * 基于浏览器原生 Web Crypto API 的加密工具
 */
const CryptoHelper = {
    // 将密码转为可用于 AES 的 Key
    async _deriveKey(password) {
        const encoder = new TextEncoder();
        const pwHash = await crypto.subtle.digest('SHA-256', encoder.encode(password));
        return await crypto.subtle.importKey(
            'raw', pwHash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']
        );
    },

    async encrypt(text, password) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this._deriveKey(password);
        const encodedText = new TextEncoder().encode(text);

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encodedText
        );

        // Web Crypto 将密文和 AuthTag 合并在一起输出
        const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedBuffer), iv.length);

        // 转为 Base64 方便存储
        return btoa(String.fromCharCode(...combined));
    },

    async decrypt(base64Data, password) {
        try {
            const combined = new Uint8Array(atob(base64Data).split("").map(c => c.charCodeAt(0)));
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);
            const key = await this._deriveKey(password);

            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            return new TextDecoder().decode(decryptedBuffer);
        } catch (e) {
            throw new Error("解密失败：密码错误或数据损坏");
        }
    }
};