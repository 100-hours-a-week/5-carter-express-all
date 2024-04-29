const cButton = document.getElementById('completeButton');
const helperText = document.getElementById('helperText');

document.addEventListener('DOMContentLoaded', function () {
    completeButton.disabled = true;
    const { userId, postId } = getUserAndPostIdFromUrl();
    fetch('http://localhost:3001/users/' + userId + '/image')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            const profileImage = document.getElementById('profileImage');
            profileImage.src = imageUrl;
        });
    fetch('http://localhost:3001/posts')
        .then(response => response.json())
        .then(posts => {
            const postData = posts.find(post => post.postId == postId);
            // console.log(postData);
            const inputTitle = document.getElementById('inputTitle');
            const inputContent = document.getElementById('inputContent');
            inputTitle.value = postData.title;
            inputContent.value = postData.content;
            checkTitleContent();
        });
});

function checkTitleContent() {
    const inputTitle = document.getElementById('inputTitle');
    const inputContent = document.getElementById('inputContent');
    if (inputTitle.value !== '' && inputContent.value !== '') {
        cButton.style.backgroundColor = 'rgb(127, 106, 238)';
        completeButton.disabled = false;
        helperText.textContent = '';
    } else {
        cButton.style.backgroundColor = 'rgb(172,160,235)';
        completeButton.disabled = true;
        helperText.textContent = '* 제목, 내용을 모두 작성해주세요';
    }
}
inputTitle.addEventListener('input', function () {
    checkTitleContent();
});
inputContent.addEventListener('input', function () {
    checkTitleContent();
});
// cButton.addEventListener('click', function () {
//     window.location.href = 'boarddetail.html';
// });
function toggleDropdown() {
    var dropdownContent = document.getElementById('menu-box');
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = 'none';
    }
}
function getUserAndPostIdFromUrl() {
    const url = window.location.href;
    const parts = url.split('/');
    const userId = parts[parts.length - 2];
    const postId = parts[parts.length - 1];
    return { userId, postId };
}
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', function () {
    const selectedFile = fileInput.files[0];
    const fileName = selectedFile ? selectedFile.name : '파일 선택';

    const existingFileNameElement = document.getElementById('existingFileName');
    existingFileNameElement.textContent = fileName;
});
completeButton.addEventListener('click', function () {
    const { userId, postId } = getUserAndPostIdFromUrl();
    const title = document.getElementById('inputTitle').value;
    const content = document.getElementById('inputContent').value;
    const fileInput = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', fileInput);
    fetch('http://localhost:3001/posts', {
        method: 'PATCH',
        body: formData,
    });
    window.location.href = `/board/detail/:${userId}/:${postId}`;
});
