// https://console.firebase.google.com/project/chat-app-1935c/database/chat-app-1935c-default-rtdb/data/~2Fchat

function myFunction() {
  console.log("Đây là hàm chạy sau mỗi 3 giây!");
  // Thêm các công việc bạn muốn thực hiện sau mỗi 3 giây ở đây
}

// Gọi hàm đầu tiên ngay từ đầu
myFunction();

// Thiết lập hàm chạy liên tục sau mỗi 3 giây
const intervalId = setInterval(myFunction, 3000);

// Để dừng hàm chạy sau một khoảng thời gian nào đó, bạn có thể sử dụng hàm clearInterval
// Ví dụ: dừng hàm chạy sau 15 giây
setTimeout(() => {
  clearInterval(intervalId);
  console.log("Hàm chạy đã dừng sau 15 giây!");
}, 15000);

function fillAny() {
  sendGetRequest(url + "/anyone.json", function (response) {
    var result = JSON.parse(response);
    console.log(result)
    // Lặp qua các khóa trong đối tượng JSON
    for (var key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        var content = result[key];
        genMessage('Unknow', imageAny, content);
      }
    }
  });
}
