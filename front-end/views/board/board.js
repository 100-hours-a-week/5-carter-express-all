BACKEND_IP_PORT = localStorage.getItem("backend-ip-port");

const userId = sessionStorage.getItem("user");

const profileImage = document.getElementById("profileImage");
const writeButton = document.getElementById("writeButton");

function toggleDropdown() {
  const dropdownContent = document.getElementById("menu-box");
  dropdownContent.style.display =
    dropdownContent.style.display === "none" ? "block" : "none";
}

function transformLikes(number) {
  if (number >= 100000) {
    return "100k";
  } else if (number >= 10000) {
    return "10k";
  } else if (number >= 1000) {
    return "1k";
  } else return number;
}

function displayPosts(posts) {
  const postContainer = document.getElementById("post-container");
  posts.forEach(async (post, index) => {
    const container = document.createElement("div");
    container.classList.add("my-box");

    container.postId = post.postId;
    container.style.top = `calc(300px + ${index * 180}px)`;

    const nickname = post.nickname;

    let url;
    await fetch(`${BACKEND_IP_PORT}/users/${post.userId}/image`)
      .then((response) => response.blob())
      .then((blob) => {
        url = URL.createObjectURL(blob);
      });

    post.likes = transformLikes(post.likes);
    post.count_comment = transformLikes(post.comment_count);
    post.views = transformLikes(post.views);

    container.innerHTML = `
      <div class="title">${post.title}</div>
      <div class="like">좋아요 ${post.likes} 댓글 ${post.count_comment} 조회수 ${post.views}</div>
      <div class="date">${post.date}</div>
      <hr />
      <div class="user"><img class="profile" src="${url}" /> <div class="author">${nickname}</div></div>
    `;

    container.addEventListener("click", async () => {
      window.location.href = `/posts/detail/:${container.postId}`;
    });

    postContainer.appendChild(container);
  });
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
    });

  await fetch(`${BACKEND_IP_PORT}/posts`)
    .then((response) => response.json())
    .then((data) => {
      displayPosts(data);
    })
    .catch((error) => console.error("Error fetching posts:", error));
});

writeButton.onmouseover = () => (writeButton.style.backgroundColor = "#7F6AEE");
writeButton.onmouseout = () => (writeButton.style.backgroundColor = "#ACA0EB");
writeButton.addEventListener("click", () => {
  window.location.href = `/posts/register`;
});
