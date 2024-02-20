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

function chat(type, content) {
  if (content.trim() === '') {
    alert("Bạn SẼ bị ỉa chảY SUỐT ĐỜI");
    return;
  }
  if (type === 'anyone') {
    sendPostRequest(url + "/anyone.json", content, function (response) {});
    thread();
    document.getElementById('chatDisplay').scrollTop = document.getElementById('chatDisplay').scrollHeight;
  }
}

function fillAny() {
  sendGetRequest(url + "/anyone.json", function (response) {
    var result = JSON.parse(response);
    localStorage.setItem('messages', JSON.stringify(result));
    for (var key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        var content = result[key];
        genMessage('Unknow', imageAny, content);
      }
    }
  });
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

function loadChannel() {
  let channel = localStorage.getItem('channel') || 'anyone';
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
      if (!mes) localStorage.setItem('messages', JSON.stringify(result));
      const compare = areObjectsEqual(result, JSON.parse(localStorage.getItem('messages')));
      if (!compare) {
        localStorage.setItem('messages', JSON.stringify(result));
        const keys = Object.keys(result);
        const lastKey = keys[keys.length - 1];
        const content = result[lastKey];
        genMessage('Unknow', imageAny, content);
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

const intervalId = setInterval(thread, 2000);
