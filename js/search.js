let debounceTimer;


function sendGetRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status == 200) {
        callback(xhr.responseText);
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };
  xhr.send();
}
// <mark>aaa</mark> 
function getResult(val) {
  let messagesString = localStorage.getItem('messages');
  let messages = messagesString ? JSON.parse(messagesString) : [];
  let mesResult = [];
  for (let m of messages) {
    if (m.content.includes(val)) {
      mesResult.push(m);
      const element = document.querySelector(`[content="${m.content}"] .content`);
      element.innerHTML = m.content.replace(val, `<mark>${val}</mark>`);
    }
  }
  if (mesResult.length > 0)
    document.getElementById('result-search').textContent = `có ${mesResult.length} kết quả được tìm thấy`;
}

//Lắng nghe sự kiện "input" trên phần tử có id là "myInput"
// document.getElementById('search').addEventListener('input', function (event) {
//   if (event.target.value)
//     console.log('Giá trị nhập vào:', event.target.value);
// });


function debounce(func, delay) {
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

// Hàm tìm kiếm
function search(value) {
  // Thực hiện tìm kiếm dựa trên giá trị nhập vào
  getResult(value);
}

// Lắng nghe sự kiện onChange của ô tìm kiếm
document.getElementById('search').addEventListener('input', debounce(function (event) {
  const searchTerm = event.target.value;
  search(searchTerm);
}, 300)); // 300ms là khoảng thời gian debounce
