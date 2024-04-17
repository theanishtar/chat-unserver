const url = 'https://chat-app-1935c-default-rtdb.asia-southeast1.firebasedatabase.app/chat';
const imageAny = './images/08-15-27-06-cat_ready.gif';
let messages = localStorage.getItem('messages');

function sendPostRequest(url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      callback(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify(data));
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

function genMessage(name, image, content) {
  const parent = document.getElementById('chatDisplay');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  const img = document.createElement('img');
  img.src = image;
  img.alt = name;
  img.classList.add('user-avatar');
  const contentDiv = document.createElement('div');
  const userNameSpan = document.createElement('span');
  userNameSpan.classList.add('user-name');
  userNameSpan.textContent = name;
  const messageContentDiv = document.createElement('div');
  messageContentDiv.classList.add('content');
  messageContentDiv.textContent = content;
  contentDiv.appendChild(userNameSpan);
  contentDiv.appendChild(messageContentDiv);
  messageDiv.appendChild(img);
  messageDiv.appendChild(contentDiv);
  parent.appendChild(messageDiv);
}


// Hàm chat() với callback
function chat(channel, content, callback) {
  if (content.trim() === '') {
    alert("Bạn Sẽ bị ỉa chảY SUỐT ĐỜI");
    return;
  }
  if (channel === 'anyone') {
    sendPostRequest(url + "/anyone.json", content, function (response) { });
    genMessage('Unknow', imageAny, content);
    const messages = JSON.parse(localStorage.getItem('messages'));
    const mes = {
      channel: `Unknow`,
      image: imageAny,
      content: content
    }
    messages.push(mes);
    localStorage.setItem('messages', JSON.stringify(messages));
    document.getElementById('chatDisplay').scrollTop = document.getElementById('chatDisplay').scrollHeight;
  }
  // Code giả định là gửi tin nhắn mất 1 giây
  setTimeout(function () {
    if (typeof callback === 'function') {
      callback(); // Gọi callback khi xong
    } else {
      console.log('Callback is not a function.');
    }
  }, 1000);
}

function sendMessage() {
  var channel = document.getElementById('channel').value;
  var message = document.getElementById('message').value;

  document.getElementById('message').value = '';
  chat('anyone', message, function () {
    scrollToBottomChat();
  });
}

function loadChannel() {
  let channel = localStorage.getItem('channel') || 'anyone';
  if (channel === 'anyone') {
    fillAny();
  }
}

function clearMessages() {
  var messages = document.querySelectorAll('.message'); // Lấy tất cả các phần tử có class là "message"
  messages.forEach(function (message) {
    message.remove(); // Xóa phần tử
  });
}

function fillAny() {
  messages = [];
  sendGetRequest(url + "/anyone.json", function (response) {
    var result = JSON.parse(response);
    for (var key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        var content = result[key];
        genMessage('Unknow', imageAny, content);
        const mes = {
          channel: `Unknow`,
          image: imageAny,
          content: content
        }
        messages.push(mes);
      }
    }
    document.getElementById('chatDisplay').scrollTop = document.getElementById('chatDisplay').scrollHeight;
    console.log(messages)
    localStorage.setItem('messages', JSON.stringify(messages));
  });
}

function scrollToBottomChat() {
  var chatDisplay = document.getElementById('chatDisplay');
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function thread() {
  const channel = localStorage.getItem('channel');
  let messagesString = localStorage.getItem('messages');
  let messages = messagesString ? JSON.parse(messagesString) : [];

  if (channel === 'anyone') {
    sendGetRequest(url + "/anyone.json", function (response) {
      var messArr = [];
      var result = JSON.parse(response);
      for (var key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          var content = result[key];
          const mes = {
            channel: `Unknow`,
            image: imageAny,
            content: content
          }
          messArr.push(mes);
        }
      }
      const compare = areObjectsEqual(messArr, JSON.parse(localStorage.getItem('messages')));
      if (!compare) {
        // cập nhật lại và gen mess
        localStorage.setItem('messages', messArr);
        clearMessages();
        fillAny();
      }
    });
  }
}


function areObjectsEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (!areObjectsEqual(val1, val2)) return false;
    } else {
      if (val1 !== val2) return false;
    }
  }
  return true;
}

// vừa vào app
window.onload = function () {
  loadChannel();
}

const intervalId = setInterval(thread, 2000);