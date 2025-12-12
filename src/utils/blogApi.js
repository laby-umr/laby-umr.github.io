/**
 * Blog API 服务
 * 与后端 laby-module-blog 模块对接
 * 
 * 注意：访客统计已改用 Google Analytics 4
 * 本文件仅保留订阅和留言功能
 */

// API 基础地址
// 在Docusaurus中，环境变量需要通过docusaurus.config.js配置
const API_BASE_URL = typeof window !== 'undefined' && window.blogApiConfig 
  ? window.blogApiConfig.apiBaseUrl 
  : 'http://localhost:48080';

/**
 * 通用请求方法
 */
async function request(url, options = {}) {
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('🚀 API请求:', fullUrl);
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API错误:', data);
      throw new Error(data.msg || '请求失败');
    }

    console.log('✅ API成功:', data);
    return data;
  } catch (error) {
    console.error('❌ API异常:', error);
    throw error;
  }
}

/**
 * 订阅API
 */
export const subscribeApi = {
  /**
   * 创建订阅
   * @param {Object} data - 订阅信息
   * @param {string} data.email - 邮箱
   * @param {string} data.nickname - 昵称
   * @returns {Promise<number>} 订阅ID
   */
  async create(data) {
    const result = await request('/app-api/blog/subscribe/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data;
  },

  /**
   * 激活订阅
   * @param {string} code - 激活码
   */
  async activate(code) {
    await request(`/app-api/blog/subscribe/activate?code=${encodeURIComponent(code)}`, {
      method: 'GET',
    });
  },

  /**
   * 取消订阅
   * @param {string} email - 邮箱
   */
  async cancel(email) {
    await request(`/app-api/blog/subscribe/cancel?email=${encodeURIComponent(email)}`, {
      method: 'POST',
    });
  },
};

/**
 * 留言API
 */
export const messageApi = {
  /**
   * 创建留言
   * @param {Object} data - 留言信息
   * @param {string} data.name - 姓名
   * @param {string} data.email - 邮箱
   * @param {string} data.phone - 电话（可选）
   * @param {string} data.subject - 主题
   * @param {string} data.content - 内容
   * @returns {Promise<number>} 留言ID
   */
  async create(data) {
    const result = await request('/app-api/blog/message/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data;
  },
};

// 访客统计已迁移到 Google Analytics 4
// useVisitorTracking 已移除，现在由 GA4 自动处理
