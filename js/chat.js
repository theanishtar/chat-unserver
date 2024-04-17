const url = 'https://chat-app-1935c-default-rtdb.asia-southeast1.firebasedatabase.app/chat';
const imageAny = './images/08-15-27-06-cat_ready.gif';

let messages = localStorage.getItem('messages') ? JSON.parse(localStorage.getItem('messages')) : [];

const sendPostRequest = (url, data, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      callback(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify(data));
}

const sendGetRequest = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
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

const genMessage = (name, image, content) => {
  const parent = document.getElementById('chatDisplay');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(`message`);
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
  contentDiv.setAttribute('content', content);
  messageDiv.appendChild(img);
  messageDiv.appendChild(contentDiv);
  parent.appendChild(messageDiv);
}

const chat = (channel, content, callback) => {
  if (content.trim() === '') {
    alert("Bạn Sẽ bị ỉa chảY SUỐT ĐỜI");
    return;
  }
  if (channel === 'anyone') {
    sendPostRequest(`${url}/anyone.json`, content, () => { });
    genMessage('Unknow', imageAny, content);
    messages.push({ channel: 'Unknow', image: imageAny, content });
    localStorage.setItem('messages', JSON.stringify(messages));
    document.getElementById('chatDisplay').scrollTop = document.getElementById('chatDisplay').scrollHeight;
  }
  setTimeout(() => {
    if (typeof callback === 'function') {
      callback();
    } else {
      console.log('Callback is not a function.');
    }
  }, 1000);
}

const sendMessage = () => {
  const channel = document.getElementById('channel').value;
  const message = document.getElementById('message').value;
  document.getElementById('message').value = '';
  chat('anyone', message, () => scrollToBottomChat());
}

const loadChannel = () => {
  const channel = localStorage.getItem('channel') || 'anyone';
  if (channel === 'anyone') {
    fillAny();
  }
}

const clearMessages = () => {
  const messages = document.querySelectorAll('.message');
  messages.forEach((message) => {
    message.remove();
  });
}

const fillAny = () => {
  messages = [];
  sendGetRequest(`${url}/anyone.json`, (response) => {
    const result = JSON.parse(response);
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const content = result[key];
        genMessage('Unknow', imageAny, content);
        messages.push({ channel: 'Unknow', image: imageAny, content });
      }
    }
    document.getElementById('chatDisplay').scrollTop = document.getElementById('chatDisplay').scrollHeight;
    localStorage.setItem('messages', JSON.stringify(messages));
  });
}

const scrollToBottomChat = () => {
  const chatDisplay = document.getElementById('chatDisplay');
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

const thread = () => {
  const channel = localStorage.getItem('channel');
  let messagesString = localStorage.getItem('messages');
  let messages = messagesString ? JSON.parse(messagesString) : [];

  if (channel === 'anyone') {
    sendGetRequest(`${url}/anyone.json`, (response) => {
      const messArr = [];
      const result = JSON.parse(response);
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const content = result[key];
          const mes = { channel: 'Unknow', image: imageAny, content };
          messArr.push(mes);
        }
      }
      const compare = JSON.stringify(messArr) === JSON.stringify(messages);
      if (!compare) {
        localStorage.setItem('messages', JSON.stringify(messArr));
        clearMessages();
        fillAny();
      }
    });
  }
}

window.onload = () => {
  loadChannel();
}

const intervalId = setInterval(thread, 2000);
