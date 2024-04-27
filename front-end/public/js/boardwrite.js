const inputTitle = document.getElementById('inputTitle');
const inputContent = document.getElementById('inputContent');
const cButton = document.getElementById('completeButton');
const helperText = document.getElementById('helperText');

document.addEventListener('DOMContentLoaded', function () {
    completeButton.disabled = true;
});
inputTitle.addEventListener('input', function () {
    if (inputTitle.value !== '' && inputContent.value !== '') {
        cButton.style.backgroundColor = 'rgb(127, 106, 238)';
        completeButton.disabled = false;
        helperText.textContent = '';
        console.log('활성화');
    } else {
        cButton.style.backgroundColor = 'rgb(172,160,235)';
        completeButton.disabled = true;
        helperText.textContent = '* 제목, 내용을 모두 작성해주세요';
    }
});
inputContent.addEventListener('input', function () {
    if (inputTitle.value !== '' && inputContent.value !== '') {
        cButton.style.backgroundColor = 'rgb(127, 106, 238)';
        helperText.textContent = '';
        completeButton.disabled = false;
        console.log('활성화');
    } else {
        cButton.style.backgroundColor = 'rgb(172,160,235)';
        completeButton.disabled = true;
        helperText.textContent = '* 제목, 내용을 모두 작성해주세요';
    }
});

completeButton.addEventListener('click', function () {
    const title = document.getElementById('inputTitle').value;
    const content = document.getElementById('inputContent').value;
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file);

    fetch('http://localhost:3001/posts/register', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        // .then(data => {
        //     console.log('Data sent successfully:', data);
        //     // 성공적으로 보내졌을 때 처리
        //     // 예: 페이지를 다른 곳으로 이동하거나 사용자에게 알림을 표시합니다.
        // })
        .catch(error => {
            console.error(
                'There was a problem with the fetch operation:',
                error,
            );
            // 오류 발생시 처리
            // 예: 사용자에게 오류 메시지를 표시합니다.
        });
    window.location.href = 'board.html';
});
function toggleDropdown() {
    var dropdownContent = document.getElementById('menu-box');
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = 'none';
    }
}

const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');

fileInput.addEventListener('change', function () {
    const fileName = this.files[0].name;
    fileNameDisplay.textContent = fileName;
});
