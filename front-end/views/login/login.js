const BACKEND_IP_PORT = "http://localhost:8081";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const helperText = document.getElementById("helpingText");

const loginButton = document.getElementById("submitLogin");

async function validateAccount() {
  const email = emailInput.value;
  const password = passwordInput.value;
  const data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
    credentials: "include",
  };

  const response = await fetch(`${BACKEND_IP_PORT}/users/login`, data);
  const auth = await response.json();
  return auth.id;
}

document.addEventListener("DOMContentLoaded", () => {
  sessionStorage.removeItem("user");
  document.cookie =
    "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  validateAccount().then((id) => {
    if (id) {
      loginButton.style.backgroundColor = "#7F6AEE";

      sessionStorage.setItem("user", id);

      setTimeout(() => {
        window.location.href = "/posts";
      }, 3000);
    } else {
      helperText.textContent = "* 입력하신 계정 정보가 정확하지 않았습니다.";
    }
  });
});
