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
        return '* 비밀번호를 한번 더 입력해주세요';
    }

    if (confirmPassword !== password) {
        return '* 비밀번호가 다릅니다';
    }

    return '';
}
function checkMessages() {
    const m1 = confirmPasswordMessage.textContent.trim() === '';
    const m2 = passwordMessage.textContent.trim() === '';

    if (m1 && m2) {
        modifyButton.disabled = false;
        modifyButton.style.backgroundColor = 'rgb(127, 106, 238)';
    } else {
        modifyButton.disabled = true;
        modifyButton.style.backgroundColor = 'rgb(172,160,235)';
    }
}

function toast(string) {
    const toast = document.getElementById('toast');

    toast.classList.contains('reveal')
        ? (clearTimeout(removeToast),
          (removeToast = setTimeout(function () {
              document.getElementById('toast').classList.remove('reveal');
          }, 1000)))
        : (removeToast = setTimeout(function () {
              document.getElementById('toast').classList.remove('reveal');
          }, 1000));
    toast.classList.add('reveal'), (toast.innerText = string);
}
const passwordInput = document.getElementById('passwordInput');
const confirmPasswordInput = document.getElementById('confirmInput');
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
modifyButton.addEventListener('click', function () {
    toast('수정완료');
});
function toggleDropdown() {
    var dropdownContent = document.getElementById('menu-box');
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('menu-box').style.display = 'none';
    const userId = getUserIdFromURL();
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
            const profileImageInput =
                document.getElementById('profileImageInput');
            profileImage.src = imageUrl;
        });
});
function getUserIdFromURL() {
    const url = window.location.href;
    const userIdIndex = url.lastIndexOf('/:');
    if (userIdIndex !== -1) {
        return url.substring(userIdIndex + 2);
    }
    return null;
}

modifyButton.addEventListener('click', function () {
    const userId = getUserIdFromURL();
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    const data = {
        userId: userId,
        password: password,
    };
    fetch('http://localhost:3001/users/pw', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
});
function addUserId(event) {
    const userId = getUserIdFromURL();
    event.preventDefault();
    const href = event.target.getAttribute('href');
    const newUrl = href + '/:' + userId;
    window.location.href = newUrl;
}
