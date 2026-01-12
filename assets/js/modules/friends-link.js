(async() => {
  const container = document.querySelector('.friends-link');
  if (!container) return;

  try {
    const res = await fetch('/assets/json/friends.json');
    
    if (!res.ok) {
      throw new Error(`请求失败：${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (!Array.isArray(json?.friends)) {
      throw new Error('友链数据格式错误，friends 字段不是数组');
    }

    container.innerHTML = '';
    let friendHTML = '';

    // 嘿朋友们，新的xss防护。
    json.friends.forEach(friend => {
      const url = encodeURI(friend.url || '#');
      const avatar = encodeURI(friend.avatar || '');
      const name = friend.name ? escapeHTML(friend.name) : '未知名称';
      const title = friend.title ? escapeHTML(friend.title) : '';
      const desc = friend.desc ? escapeHTML(friend.desc) : '';

      friendHTML += `
        <a class="friend-item" href="${url}" target="_blank" rel="noopener noreferrer">
          <img src="${avatar}" alt="${name}" loading="lazy">
          <div class="friend-info">
            <span>${title}</span>
            <p>${name} • ${desc}</p>
          </div>
        </a>
      `;
    });
    container.innerHTML = friendHTML;
  } catch (error) {
    console.error('Hey! Your fucking code is wrong:', error);
    container.innerHTML = '<p>友链加载失败啦 😭</p>';
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();