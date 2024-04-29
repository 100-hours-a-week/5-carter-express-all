// 이메일, 비밀번호 입력창
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (email.trim() === '' || password.trim() === '') {
            document.getElementById('helpingText').textContent =
                '* 입력하신 계정 정보가 정확하지 않았습니다.';
            return;
        }
        const loginButton = document.getElementById('submitLogin');
        loginButton.style.backgroundColor = 'rgb(127, 106, 238)';

        const loginData = { email: email, password: password };
        fetch('http://localhost:3001/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTimeout(function () {
                    window.location.href = `/board/:${data.userId}`;
                }, 3000);
            })
            .catch(error => {
                console.error('Error fetching login data:', error);
            });
    });
});
