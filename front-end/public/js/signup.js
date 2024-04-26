const profileInput = document.getElementById('fileInput');
const profileMessage = document.getElementById('profileHelpingText');
const emailInput = document.getElementById('input-email');
const emailMessage = document.getElementById('emailHelper');
const passwordInput = document.getElementById('input-pw');
const pwMessage = document.getElementById('passwordHelper');
const confirmInput = document.getElementById('confirm-pw');
const confirmMessage = document.getElementById('confirmPasswordHelper');
const nicknameInput = document.getElementById('input-nickname');
const nicknameMessage = document.getElementById('nicknameHelper');

document.addEventListener('DOMContentLoaded', function () {
    signupButton.disabled = true;
});
function checkMessages() {
    const m1 = profileMessage.textContent.trim() === '';
    const m2 = emailMessage.textContent.trim() === '';
    const m3 = pwMessage.textContent.trim() === '';
    const m4 = confirmMessage.textContent.trim() === '';
    const m5 = nicknameMessage.textContent.trim() === '';
    if (m1 && m2 && m3 && m4 && m5) {
        signupButton.disabled = false;
        signupButton.style.backgroundColor = 'rgb(127, 106, 238)';
    } else {
        signupButton.disabled = true;
        signupButton.style.backgroundColor = 'rgb(172,160,235)';
    }
}

signupButton.addEventListener('click', async function () {
    const email = document.getElementById('input-email').value;
    const nickname = document.getElementById('input-nickname').value;
    const password = document.getElementById('input-pw').value;
    const file = document.getElementById('fileInput').files[0];
    const formData = new FormData();
    formData.append('email', email);
    formData.append('nickname', nickname);
    formData.append('password', password);
    formData.append('file', file);

    fetch('http://localhost:3001/users/signup', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error(
                'There was a problem with the fetch operation:',
                error,
            );
        });
    // window.location.href = 'login.html';
});

// 프로필 이미지 입력창
document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageDataUrl = e.target.result;
            document.getElementById('uploadButton').style.backgroundImage =
                `url('${imageDataUrl}')`;
            document.getElementById('profileHelpingText').textContent = '';
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('uploadButton').style.backgroundImage = 'none';
        document.getElementById('profileHelpingText').textContent =
            '* 프로필 사진을 추가해주세요.';
    }
    checkMessages();
});

//이메일 입력창
function checkDuplicateEmail(email) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3001/models/data.json')
            .then(response => response.json())
            .then(data => {
                const users = data.users;
                const isDuplicate = users.some(user => user.email === email);
                resolve(isDuplicate); // 중복 여부를 Promise로 반환
            })
            .catch(error => {
                reject(error); // 오류 발생 시 reject 처리
            });
    });
}
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

document.addEventListener('click', function (event) {
    // const emailInput = document.getElementById('input-email');
    const isClickedOutside = !emailInput.contains(event.target);
    if (isClickedOutside) {
        const email = emailInput.value;

        // 중복 이메일 확인 비동기 처리
        checkDuplicateEmail(email)
            .then(isDuplicate => {
                if (isDuplicate) {
                    document.getElementById('emailHelper').textContent =
                        '* 중복된 이메일입니다.';
                } else if (
                    email === '' ||
                    email.length < 5 ||
                    !validateEmail(email)
                ) {
                    document.getElementById('emailHelper').textContent =
                        '* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
                } else {
                    document.getElementById('emailHelper').textContent = '';
                }
            })
            .catch(error => {
                console.error('중복 이메일 확인 중 에러 발생:', error);
            });
    }
    checkMessages();
});

// 비밀번호, 비밀번호 확인 입력창

function validatePassword(password) {
    if (password === '') {
        return '* 비밀번호를 입력해주세요';
    }

    if (password.length < 8 || password.length > 20) {
        return '* 비밀번호는 8자 이상, 20자 이하여야 합니다';
    }

    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /[0-9]/;

    if (
        !hasSpecialCharacter.test(password) ||
        !hasUppercase.test(password) ||
        !hasLowercase.test(password) ||
        !hasNumber.test(password)
    ) {
        return '* 비밀번호는 특수문자, 대소문자, 숫자를 모두 포함해야 합니다';
    }

    return '';
}

function validatePasswordMatch() {
    const confirmPassword = confirmPasswordInput.value;
    const password = passwordInput.value;

    if (confirmPassword === '') {
        return '* 비밀번호 확인을 입력해주세요';
    }

    if (confirmPassword !== password) {
        return '* 비밀번호가 일치하지 않습니다';
    }

    return '';
}

// const passwordInput = document.getElementById('input-pw');
const confirmPasswordInput = document.getElementById('confirm-pw');
const passwordMessage = document.getElementById('passwordHelper');
const confirmPasswordMessage = document.getElementById('confirmPasswordHelper');

passwordInput.addEventListener('input', function () {
    const validationMessage = validatePassword(passwordInput.value);
    passwordMessage.textContent = validationMessage;
    if (validationMessage === '') {
        const validationM1 = validatePasswordMatch();
        passwordMessage.textContent = validationM1;
        confirmPasswordMessage.textContent = validationM1;
    }
    checkMessages();
});

confirmPasswordInput.addEventListener('input', function () {
    let validationMessage = validatePassword(confirmPasswordInput.value);
    if (validationMessage === '') {
        validationMessage = validatePasswordMatch();
        confirmPasswordMessage.textContent = validationMessage;
        passwordMessage.textContent = validationMessage;
    } else {
        confirmPasswordMessage.textContent = validationMessage;
    }
    checkMessages();
});

// 닉네임
function checkDuplicateNickname(nickname) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3001/models/data.json')
            .then(response => response.json())
            .then(data => {
                const users = data.users;
                const isDuplicate = users.some(
                    user => user.nickname === nickname,
                );
                resolve(isDuplicate); // 중복 여부를 Promise로 반환
            })
            .catch(error => {
                reject(error); // 오류 발생 시 reject 처리
            });
    });
}
document
    .getElementById('input-nickname')
    .addEventListener('input', function () {
        const nicknameInput = document.getElementById('input-nickname');
        const nicknameMessage = document.getElementById('nicknameHelper');
        nickname = nicknameInput.value;
        if (nickname === '') {
            nicknameMessage.textContent = '* 닉네임을 입력해주세요';
        } else if (nickname.includes(' ')) {
            nicknameMessage.textContent = '* 띄어쓰기를 없애주세요';
        } else if (nickname.length > 10) {
            nicknameMessage.textContent =
                '* 닉네임은 최대 10자 까지 작성 가능합니다';
        } else {
            checkDuplicateNickname(nickname)
                .then(isDuplicate => {
                    if (isDuplicate) {
                        nicknameMessage.textContent = '* 중복된 닉네임입니다.';
                    } else {
                        nicknameMessage.textContent = '';
                    }
                })
                .catch(error => {
                    console.error('중복 닉네임 확인 중 에러 발생:', error);
                });
        }
        checkMessages();
    });
