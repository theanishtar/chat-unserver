let debounceTimer;

const getResult = (val) => {
  const messagesString = localStorage.getItem('messages');
  const messages = messagesString ? JSON.parse(messagesString) : [];
  const mesResult = [];
  for (const m of messages) {
    if (m.content.includes(val)) {
      mesResult.push(m);
      const element = document.querySelector(`[content="${m.content}"] .content`);
      element.innerHTML = m.content.replace(val, `<mark>${val}</mark>`);
    }
  }
  if (mesResult.length > 0) {
    document.getElementById('result-search').textContent = `có ${mesResult.length} kết quả được tìm thấy`;
  }
};

const debounce = (func, delay) => {
  return (...args) => {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, [...args]), delay);
  };
};


// Hàm tìm kiếm
const search = (value) => {
  // Thực hiện tìm kiếm dựa trên giá trị nhập vào
  getResult(value);
};

// Lắng nghe sự kiện onChange của ô tìm kiếm
document.getElementById('search').addEventListener('input', debounce((event) => {
  const searchTerm = event.target.value;
  search(searchTerm);
}, 300)); // 300ms là khoảng thời gian debounce
