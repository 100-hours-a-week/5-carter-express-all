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
    } else {
        cButton.style.backgroundColor = 'rgb(172,160,235)';
        completeButton.disabled = true;
        helperText.textContent = '* 제목, 내용을 모두 작성해주세요';
    }
});
cButton.addEventListener('click', function () {
    window.location.href = 'boarddetail.html';
});
function toggleDropdown() {
    var dropdownContent = document.getElementById('menu-box');
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = 'none';
    }
}
