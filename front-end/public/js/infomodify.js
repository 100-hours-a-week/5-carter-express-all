let userNickname;

// 닉네임 입력창

function checkDuplicateNickname(nickname) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3001/users/isDuplicate/${nickname}`)
            .then(response => response.json())
            .then(data => {
                let isDuplicate = data.isDuplicate;
                if (nickname === userNickname) {
                    isDuplicate = false;
                }
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
                    const userId = getUserIdFromURL();
                    const file = document.getElementById('fileInput').files[0];
                    const formData = new FormData();
                    formData.append('nickname', nickname);
                    formData.append('file', file);
                    fetch(`http://localhost:3001/users/info/${userId}`, {
                        method: 'PATCH',
                        body: formData,
                    });
                    toast('수정완료');
                    userNickname = nickname;
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
    const userId = getUserIdFromURL();
    fetch('http://localhost:3001/users/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            window.location.href = '/';
            // return response.json();
        })
        .catch(function (error) {
            console.error(
                'There was a problem with the fetch operation:',
                error,
            );
        });
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
            profileImageInput.src = imageUrl;
        });
    fetch('http://localhost:3001/users/' + userId + '/nickname')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const nicknameInput = document.getElementById('nicknameInput');
            nicknameInput.value = data.nickname;
            userNickname = data.nickname;
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
const fileInput = document.getElementById('fileInput');
const fileButton = document.getElementById('fileButton');

fileButton.addEventListener('click', function () {
    fileInput.click();
});

fileInput.addEventListener('change', function () {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function () {
            const imgElement = document.getElementById('profileImageInput');
            imgElement.src = reader.result;
        };
        reader.readAsDataURL(selectedFile);
    }
});
