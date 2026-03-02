/**
 * 基于浏览器 fetch API 的 GitHub Gist 操作工具
 */
const GistHelper = {
    _baseUrl: "https://api.github.com/gists",

    // 私有方法：构建请求头
_getHeaders(token) {
    const headers = {
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    };
    // 只有当 token 存在时才添加认证头
    if (token && token.trim()) {
        headers["Authorization"] = `token ${token.trim()}`;
    }
    return headers;
},

    /**
     * 根据描述获取第一个匹配的 Gist ID
     */
    async findIdByName(token, description) {
        const response = await fetch(this._baseUrl, {
            headers: this._getHeaders(token)
        });
        if (!response.ok) throw new Error(`获取列表失败: ${response.status}`);
        
        const gists = await response.json();
        const target = gists.find(g => g.description === description);
        return target ? target.id : null;
    },

    /**
     * 获取指定 ID 的 Gist 详情（包含文件内容）
     */
    async get(token, id) {
        const response = await fetch(`${this._baseUrl}/${id}`, {
            headers: this._getHeaders(token)
        });
        if (!response.ok) throw new Error(`获取详情失败: ${response.status}`);
        return await response.json();
    },

    /**
     * 创建一个新的 Gist
     * files 格式: { "file1.txt": { content: "..." } }
     */
    async create(token, description, files, isPublic = false) {
        const response = await fetch(this._baseUrl, {
            method: "POST",
            headers: this._getHeaders(token),
            body: JSON.stringify({
                description: description,
                public: isPublic,
                files: files
            })
        });
        if (!response.ok) throw new Error(`创建失败: ${response.status}`);
        return await response.json();
    },

    /**
     * 更新已有的 Gist
     * files 格式: { "file1.txt": { content: "..." }, "old.txt": null }
     */
    async update(token, id, description, files) {
        const response = await fetch(`${this._baseUrl}/${id}`, {
            method: "PATCH",
            headers: this._getHeaders(token),
            body: JSON.stringify({
                description: description,
                files: files
            })
        });
        if (!response.ok) throw new Error(`更新失败: ${response.status}`);
        return await response.json();
    }

};
