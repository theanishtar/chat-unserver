const url = 'https://chat-app-1935c-default-rtdb.asia-southeast1.firebasedatabase.app/chat';
const imageAny = './images/08-15-27-06-cat_ready.gif';
let messages = localStorage.getItem('messages');

// Hàm gửi yêu cầu POST đến một URL
function sendPostRequest(url, data, callback) {
  // Tạo một đối tượng XMLHttpRequest
  var xhr = new XMLHttpRequest();

  // Thiết lập phương thức và URL yêu cầu
  xhr.open("POST", url, true);

  // Thiết lập tiêu đề của yêu cầu nếu cần
  xhr.setRequestHeader("Content-Type", "application/json");

  // Xử lý sự kiện khi yêu cầu hoàn thành
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      // Gọi hàm callback với kết quả khi yêu cầu hoàn thành
      callback(xhr.responseText);
    }
  };

  // Chuyển đổi dữ liệu thành chuỗi JSON (nếu có)
  var jsonData = JSON.stringify(data);

  // Gửi yêu cầu với dữ liệu đã chuyển đổi
  xhr.send(jsonData);
}

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

function chat(type, content) {
  if (content.trim() === '') {
    alert("Bạn SẼ bị ỉa chảY SUỐT ĐỜI");
    return;
  }
  if (type === 'anyone') {
    // Gọi hàm sendPostRequest với thông tin cần thiết
    sendPostRequest(url + "/anyone.json", content, function (response) {
    });

    thread();
    // Lấy tham chiếu đến phần tử có khả năng cuộn
    const scrollableDiv = document.getElementById('chatDisplay');

    // Cuộn xuống cuối cùng của phần tử
    scrollableDiv.style.transition = '9s ease'; // Thiết lập transition trong JavaScript
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  }
}

function fillAny() {
  sendGetRequest(url + "/anyone.json", function (response) {
    var result = JSON.parse(response);
    localStorage.setItem('messages', JSON.stringify(result));
    // Lặp qua các khóa trong đối tượng JSON
    for (var key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        var content = result[key];
        genMessage('Unknow', imageAny, content);
      }
    }
  });
}

function genMessage(name, image, content) {
  // lấy e cha
  const parent = document.getElementById('chatDisplay');

  // Tạo phần tử div chính
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  // Tạo phần tử hình ảnh
  const img = document.createElement('img');
  img.src = image;
  img.alt = name;
  img.classList.add('user-avatar');

  // Tạo phần tử div chứa thông tin người dùng và nội dung
  const contentDiv = document.createElement('div');

  // Tạo phần tử span chứa tên người dùng
  const userNameSpan = document.createElement('span');
  userNameSpan.classList.add('user-name');
  userNameSpan.textContent = name;

  // Tạo phần tử div chứa nội dung tin nhắn
  const messageContentDiv = document.createElement('div');
  messageContentDiv.classList.add('content');
  messageContentDiv.textContent = content;

  // Gắn các phần tử con vào phần tử cha
  contentDiv.appendChild(userNameSpan);
  contentDiv.appendChild(messageContentDiv);

  messageDiv.appendChild(img);
  messageDiv.appendChild(contentDiv);

  // Thêm phần tử messageDiv vào body hoặc container mong muốn
  parent.appendChild(messageDiv);

}

function loadChannel() {
  let channel = localStorage.getItem('channel');
  if (channel === null) {
    localStorage.setItem('channel', 'anyone')
  }
  channel = localStorage.getItem('channel');
  if (channel === 'anyone') {
    fillAny();
  }
}

function thread() {
  const channel = localStorage.getItem('channel');

  if (channel === 'anyone') {
    sendGetRequest(url + "/anyone.json", function (response) {
      var result = JSON.parse(response);
      let mes = localStorage.getItem('messages');
      console.log(`MES: ${(mes)}`);
      console.log(`RESULT: ${(result)}`);
      if (!mes)
        localStorage.setItem('messages', JSON.stringify(result));
      const compare = areObjectsEqual(result, JSON.parse(localStorage.getItem('messages')));
      console.log(compare);
      if (!compare) {
        localStorage.setItem('messages', JSON.stringify(result));
        // Lấy mảng các khóa
        const keys = Object.keys(result);

        // Lấy phần tử cuối cùng
        const lastKey = keys[keys.length - 1];

        // Lấy giá trị tương ứng với phần tử cuối cùng
        const content = result[lastKey];
        genMessage('Unknow', imageAny, content);
      }
    });
  }

}

function areObjectsEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (!areObjectsEqual(val1, val2)) {
        return false;
      }
    } else {
      if (val1 !== val2) {
        return false;
      }
    }
  }

  return true;
}

// Thiết lập hàm chạy liên tục sau mỗi 3 giây
const intervalId = setInterval(thread, 2000);
