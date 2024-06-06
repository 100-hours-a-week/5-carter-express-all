BACKEND_IP_PORT = localStorage.getItem("backend-ip-port");

const mainTitle = document.getElementById("mainTitle");
const emailDisplay = document.getElementById("email");

const modifyButton = document.getElementById("modifyButton");

const fileInput = document.getElementById("fileInput");
const fileButton = document.getElementById("fileButton");

const modalOpenButton = document.getElementById("modalOpenButton");
const modalCloseButton = document.getElementById("modalCloseButton");
const modal = document.getElementById("modalContainer");
const agreeButton = document.getElementById("agreeButton");

const userId = sessionStorage.getItem("user");

const nicknameInput = document.getElementById("nicknameInput");
const nicknameHelper = document.getElementById("nicknameHelper");

let userNickname;
let prevNickname;

function toggleDropdown() {
  const dropdownContent = document.getElementById("menu-box");
  dropdownContent.style.display =
    dropdownContent.style.display === "none" ? "block" : "none";
}

function toast(string) {
  const toast = document.getElementById("toast");

  toast.classList.contains("reveal")
    ? (clearTimeout(removeToast),
      (removeToast = setTimeout(function () {
        document.getElementById("toast").classList.remove("reveal");
      }, 1000)))
    : (removeToast = setTimeout(function () {
        document.getElementById("toast").classList.remove("reveal");
      }, 1000));
  toast.classList.add("reveal"), (toast.innerText = string);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!userId) {
    alert("로그아웃되었습니다.");
    window.location.href = "/";
  }

  await fetch(`${BACKEND_IP_PORT}/users/${userId}/image`)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      profileImage.src = url;
      profileImageInput.src = url;
    });

  await fetch(`${BACKEND_IP_PORT}/users/${userId}/nickname`)
    .then((response) => response.json())
    .then((nickname) => {
      nicknameInput.value = nickname;
      prevNickname = nickname;
    });

  await fetch(`${BACKEND_IP_PORT}/users/${userId}/email`)
    .then((response) => response.json())
    .then((email) => {
      emailDisplay.textContent = email;
    });
});

nicknameInput.addEventListener("input", async () => {
  const nickname = nicknameInput.value;
  nicknameHelper.textContent = "";
  if (nickname === "") nicknameHelper.textContent = "* 닉네임을 입력해주세요";
  else if (nickname.length > 10)
    nicknameHelper.textContent = "* 닉네임은 최대 10자 까지 작성 가능합니다";
  else if (nickname !== prevNickname) {
    await fetch(`${BACKEND_IP_PORT}/users/nickname/${nickname}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.isDuplicate) {
          nicknameHelper.textContent = "* 중복된 닉네임입니다.";
        } else {
          nicknameHelper.textContent = "";
          modifyButton.disabled = false;
          modifyButton.style.backgroundColor = "#7F6AEE";
        }
      });
  }
});

modifyButton.addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  const nickname = nicknameInput.value;

  const formData = new FormData();
  formData.append("nickname", nickname);
  formData.append("file", file);
  fetch(`${BACKEND_IP_PORT}/users/${userId}`, {
    method: "PATCH",
    body: formData,
  });
  toast("수정완료");
  userNickname = nickname;
});

modalOpenButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

modalCloseButton.addEventListener("click", () => {
  modal.classList.add("hidden");
});

agreeButton.addEventListener("click", () => {
  fetch(`${BACKEND_IP_PORT}/users/${userId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

fileButton.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      const imgElement = document.getElementById("profileImageInput");
      imgElement.src = reader.result;
    };
    reader.readAsDataURL(selectedFile);
    modifyButton.disabled = false;
    modifyButton.style.backgroundColor = "#7F6AEE";
  }
});

mainTitle.addEventListener("click", () => {
  window.location.href = "/posts/";
});
