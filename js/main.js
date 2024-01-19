const url = 'https://chat-app-1935c-default-rtdb.asia-southeast1.firebasedatabase.app/chat';


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
  let message = {
    image: 'https://github.com/dangtranhuu/images/blob/main/cat/08-15-27-06-cat_ready.gif?raw=true',
    content: content
  }
  if (type === 'anyone') {
    // Gọi hàm sendPostRequest với thông tin cần thiết
    sendPostRequest(url + "/anyone.json", content, function (response) {
      // Xử lý kết quả trả về từ API ở đây
      alert("joined: " + response)
    });
  }
}

function fillAny() {
  const image = 'https://github.com/dangtranhuu/images/blob/main/cat/08-15-27-06-cat_ready.gif?raw=true';
  sendGetRequest(url + "/anyone.json", function (response) {
    var result = JSON.parse(response);
    console.log(result)
    // Lặp qua các khóa trong đối tượng JSON
    for (var key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        var content = result[key];
        genMessage('Unknow', image, content);
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
