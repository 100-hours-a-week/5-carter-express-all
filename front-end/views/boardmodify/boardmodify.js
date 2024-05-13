BACKEND_IP_PORT = localStorage.getItem("backend-ip-port");

const mainTitle = document.getElementById("mainTitle");

const cButton = document.getElementById("completeButton");
const helperText = document.getElementById("helperText");
const fileInput = document.getElementById("fileInput");
const inputTitle = document.getElementById("inputTitle");
const inputContent = document.getElementById("inputContent");

const userId = sessionStorage.getItem("user");
const postId = getPostIdFromUrl();

function toggleDropdown() {
  const dropdownContent = document.getElementById("menu-box");
  dropdownContent.style.display =
    dropdownContent.style.display === "none" ? "block" : "none";
}

function checkTitleContent() {
  const inputTitle = document.getElementById("inputTitle");
  const inputContent = document.getElementById("inputContent");
  if (inputTitle.value !== "" && inputContent.value !== "") {
    cButton.style.backgroundColor = "#7F6AEE";
    completeButton.disabled = false;
    helperText.textContent = "";
  } else {
    cButton.style.backgroundColor = "#ACA0EB";
    completeButton.disabled = true;
    helperText.textContent = "* 제목, 내용을 모두 작성해주세요";
  }
}

function getPostIdFromUrl() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1];
}

document.addEventListener("DOMContentLoaded", async function () {
  await fetch(`${BACKEND_IP_PORT}/users/${userId}/image`)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      profileImage.src = url;
    });

  await fetch(`${BACKEND_IP_PORT}/posts/${postId}`)
    .then((response) => response.json())
    .then((post) => {
      inputTitle.value = post.title;
      inputContent.value = post.content;
      checkTitleContent();
    });
});

inputTitle.addEventListener("input", () => {
  checkTitleContent();
});

inputContent.addEventListener("input", () => {
  checkTitleContent();
});

fileInput.addEventListener("change", () => {
  const selectedFile = fileInput.files[0];
  const fileName = selectedFile ? selectedFile.name : "파일을 선택해주세요.";
  const existingFileNameElement = document.getElementById("existingFileName");
  existingFileNameElement.textContent = fileName;
});

completeButton.addEventListener("click", async () => {
  const title = document.getElementById("inputTitle").value;
  const content = document.getElementById("inputContent").value;
  const fileInput = document.getElementById("fileInput").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("file", fileInput);
  fetch(`${BACKEND_IP_PORT}/posts/${postId}`, {
    method: "POST",
    body: formData,
  });
  window.location.href = `/posts/detail/:${postId}`;
});

mainTitle.addEventListener("click", () => {
  window.location.href = "/posts/";
});
