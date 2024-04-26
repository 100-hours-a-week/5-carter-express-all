// 이메일, 비밀번호 입력창
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username.trim() === '' || password.trim() === '') {
            document.getElementById('helpingText').textContent =
                '* 입력하신 계정 정보가 정확하지 않았습니다.';
            return;
        }
        const loginButton = document.getElementById('submitLogin');
        loginButton.style.backgroundColor = 'rgb(127, 106, 238)';
        setTimeout(function () {
            window.location.href = '/html/board.html';
        }, 3000);
    });
});
