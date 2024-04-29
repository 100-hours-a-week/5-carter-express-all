const modalOpenButton = document.getElementById('modalOpenButton');
const modalCloseButton = document.getElementById('modalCloseButton');
const modal = document.getElementById('modalContainer');
const inputComment = document.getElementById('inputComment');
// const cmodalOpenButton = document.getElementById('cmodalOpenButton');
// const cmodalCloseButton = document.getElementById('cmodalCloseButton');
// const cmodal = document.getElementById('cmodalContainer');
// const cinputComment = document.getElementById('cinputComment');

function getPostIdFromURL() {
    const url = window.location.href;
    const postIdIndex = url.lastIndexOf('/:'); // postId가 위치하는 인덱스
    if (postIdIndex !== -1) {
        return url.substring(postIdIndex + 2); // postId를 가져옴
    }
    return null; // postId를 찾지 못한 경우
}
function transformLikes(number) {
    if (number >= 100000) {
        return '100k';
    } else if (number >= 10000) {
        return '10k';
    } else if (number >= 1000) {
        return '1k';
    } else return number;
}
function displayPostDetail(post) {
    const postTitle = document.getElementById('postTitle');
    // const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const postDate = document.getElementById('postDate');
    const postImageSrc = document.getElementById('postImageSrc');
    const postContent = document.getElementById('postContent');
    const views = document.getElementById('views');
    const comments = document.getElementById('comments');
    postTitle.textContent = post.title.slice(0, 26);
    userName.textContent = post.author;
    postDate.textContent = post.date;
    postImageSrc.src = post.image;
    postContent.textContent = post.content;
    views.textContent = transformLikes(post.views);
    comments.textContent = transformLikes(post.comments);
}
function displayComments(replyData) {
    const postContainer = document.getElementById('commentContainer');
    replyData.forEach((reply, index) => {
        const container = document.createElement('div');
        container.classList.add('my-box');

        container.style.top = `calc(300px + ${index * 180}px)`;

        const nickname = `${index}nickname`;
        const date = `${index}date`;
        const content = `${index}content`;

        container.innerHTML = `
        <div id="commentsContainer">
            <div>
                 <div class="replyNickname" id="${nickname}">${reply.nickname}</div>
                 <div class="replyContent" id="${content}">${reply.content}</div>
            </div>
         <div class="replyDate" id="${date}">${reply.date}</div>
         <button class="smallButton" id="replyEdit">수정</button>
         <button class="smallButton" id="cmodalOpenButton">삭제</button>
        `;
        postContainer.appendChild(container);
    });
    document.addEventListener('click', function (event) {
        const buttons = document.querySelectorAll('#replyEdit');
        buttons.forEach(function (button, index) {
            if (button === event.target) {
                const content = document.getElementById(`${index}content`);
                const comment = document.getElementById('commentInput');
                const submitComment = document.getElementById('submitComment');
                comment.textContent = content.textContent;
                submitComment.textContent = '댓글 수정';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const { userId, postId } = getUserAndPostIdFromUrl();
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
            profileImage.src = imageUrl;
        });

    fetch('http://localhost:3001/posts')
        .then(response => response.json())
        .then(data => {
            const postData = data.find(data => data.postId == postId);
            displayPostDetail(postData);

            if (postData) {
                const replyData = postData.reply;

                displayComments(replyData);
            } else {
                console.log('Post not found');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

modalOpenButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
});
modalCloseButton.addEventListener('click', () => {
    modal.classList.add('hidden');
});
const agreeButton = document.getElementById('agreeButton');
agreeButton.addEventListener('click', function () {
    //TODO:게시글 정보 삭제
    window.location.href = 'board.html';
});

// cmodalOpenButton.addEventListener('click', () => {
//     modal.classList.remove('chidden');
// });
// cmodalCloseButton.addEventListener('click', () => {
//     modal.classList.add('chidden');
// });
// const cagreeButton = document.getElementById('cagreeButton');
// cagreeButton.addEventListener('click', function () {
//     //TODO:댓글 정보 삭제
//     window.location.href = 'board.html';
// });
postModifyButton.addEventListener('click', function () {
    const postId = getPostIdFromURL();
    window.location.href = `boardmodify.html?postId=${postId}`;
});
function toggleDropdown() {
    var dropdownContent = document.getElementById('menu-box');
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = 'none';
    }
}
function getUserAndPostIdFromUrl() {
    const url = window.location.href;
    const startIndex = url.indexOf('/board/detail/') + '/board/detail/'.length;
    const endIndex = url.indexOf('/', startIndex);
    const userId = url.slice(startIndex + 1, endIndex);
    const postId = url.slice(endIndex + 2);
    return { userId, postId };
}
