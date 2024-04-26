// 닉네임 입력창

function checkDuplicateNickname(nickname) {
    return new Promise((resolve, reject) => {
        fetch('./data.json')
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

const modifyButton = document.getElementById('modifyButton');
modifyButton.addEventListener('click', function () {
    const nicknameInput = document.getElementById('nicknameInput');
    const nicknameHelper = document.getElementById('nicknameHelper');
    nickname = nicknameInput.value;

    if (nickname === '') {
        nicknameHelper.textContent = '* 닉네임을 입력해주세요';
    } else if (nickname.length > 10) {
        nicknameHelper.textContent =
            '* 닉네임은 최대 10자 까지 작성 가능합니다';
    } else {
        checkDuplicateNickname(nickname)
            .then(isDuplicate => {
                if (isDuplicate) {
                    nicknameHelper.textContent = '* 중복된 닉네임입니다.';
                } else {
                    nicknameHelper.textContent = '';
                    toast('수정완료');
                }
            })
            .catch(error => {
                console.error('중복 닉네임 확인 중 에러 발생:', error);
            });
    }
});

//모달
const modalOpenButton = document.getElementById('modalOpenButton');
const modalCloseButton = document.getElementById('modalCloseButton');
const modal = document.getElementById('modalContainer');

modalOpenButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

modalCloseButton.addEventListener('click', () => {
    modal.classList.add('hidden');
});
const agreeButton = document.getElementById('agreeButton');
agreeButton.addEventListener('click', function () {
    //TODO:회원정보 삭제
    window.location.href = 'login.html';
});

function toggleDropdown() {
    var dropdownContent = document.getElementById('menu-box');
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = 'none';
    }
}
