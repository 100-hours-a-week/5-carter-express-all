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
