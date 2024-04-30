const modalOpenButton = document.getElementById('modalOpenButton');
const modalCloseButton = document.getElementById('modalCloseButton');
const modal = document.getElementById('modalContainer');
const inputComment = document.getElementById('commentInput');
const submitCommentButton = document.getElementById('submitComment');
let selectedCommentId;

document.addEventListener('DOMContentLoaded', async function () {
    submitCommentButton.disabled = true;
    const { userId, postId } = getUserAndPostIdFromUrl();
    await fetch('http://localhost:3001/users/' + userId + '/image')
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

    await fetch('http://localhost:3001/posts')
        .then(response => response.json())
        .then(data => {
            const postData = data.find(data => data.postId == postId);
            displayPostDetail(postData);
            displayComments();
        })
        .catch(error => console.error('Error fetching data:', error));

    await fetch('http://localhost:3001/posts/' + postId + '/image')
        .then(response => response.blob())
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            const postImageSrc = document.getElementById('postImageSrc');
            postImageSrc.src = imageUrl;
        });
});

async function displayComments() {
    const { userId, postId } = getUserAndPostIdFromUrl();
    const replyData = await fetch(
        `http://localhost:3001/posts/${postId}/comment`,
    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
    const postContainer = document.getElementById('commentContainer');
    postContainer.innerHTML = '';

    for (const [index, reply] of replyData.entries()) {
        const container = document.createElement('div');
        container.classList.add('my-box');

        container.style.top = `calc(300px + ${index * 180}px)`;

        const date = `${index}date`;
        const content = `${index}content`;
        const nicknameResponse = await fetch(
            `http://localhost:3001/users/${reply.userId}/nickname`,
        );
        const { nickname } = await nicknameResponse.json();
        const imageResponse = await fetch(
            `http://localhost:3001/users/${reply.userId}/image`,
        );
        const blob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        container.innerHTML = `
        <div id="commentsContainer">
            <div>
                <div style="display:flex;align-items:center;">
                    <img class="replyImage" id="${imageUrl}" src=${imageUrl}></image>
                    <div class="replyNickname" id="${nickname}">${nickname}</div>
                 </div>
                 <div class="replyContent" id="${content}">${reply.content}</div>
            </div>
         <div class="replyDate" id="${date}">${reply.date}</div>
         <button class="replyEdit" data-comment-id=${reply.commentId}>수정</button>
         <button class="cmodalOpenButton" data-comment-id=${reply.commentId}>삭제</button>
        `;
        postContainer.appendChild(container);
    }
    document.addEventListener('click', function (event) {
        const buttons = document.querySelectorAll('.replyEdit');
        buttons.forEach(function (button, index) {
            if (button === event.target) {
                const content = document.getElementById(`${index}content`);
                const comment = document.getElementById('commentInput');
                const submitComment = document.getElementById('submitComment');
                comment.textContent = content.textContent;
                submitComment.textContent = '댓글 수정';
                const eB = event.target.closest('.replyEdit');
                selectedCommentId = eB.dataset.commentId;
            }
        });
    });
    let commentToDeleteId;
    const cmodalOpenButtons = document.querySelectorAll('.cmodalOpenButton');
    const cmodalContainer = document.getElementById('cmodalContainer');
    const cmodalCloseButton = document.getElementById('cmodalCloseButton');
    const cagreeButton = document.getElementById('cagreeButton');
    cmodalOpenButtons.forEach(button => {
        button.addEventListener('click', function () {
            commentToDeleteId = button.dataset.commentId;
            cmodalContainer.classList.remove('hidden');
        });
    });
    cmodalCloseButton.addEventListener('click', function () {
        cmodalContainer.classList.add('hidden');
    });
    cagreeButton.addEventListener('click', function () {
        location.reload();
        const { userId, postId } = getUserAndPostIdFromUrl();
        fetch('http://localhost:3001/posts/comment', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentId: commentToDeleteId,
                postId: postId,
            }),
        });
    });
}

modalOpenButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
});
modalCloseButton.addEventListener('click', () => {
    modal.classList.add('hidden');
});
const agreeButton = document.getElementById('agreeButton');
agreeButton.addEventListener('click', function () {
    const { userId, postId } = getUserAndPostIdFromUrl();
    fetch('http://localhost:3001/posts/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postId }),
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            window.location.href = `/board/:${userId}`;
        })
        .catch(function (error) {
            console.error(
                'There was a problem with the fetch operation:',
                error,
            );
        });
});

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
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const postDate = document.getElementById('postDate');
    const postImageSrc = document.getElementById('postImageSrc');
    const postContent = document.getElementById('postContent');
    const views = document.getElementById('views');
    const comments = document.getElementById('comments');
    postTitle.textContent = post.title.slice(0, 26);
    postDate.textContent = post.date;
    postContent.textContent = post.content;
    views.textContent = transformLikes(post.views);
    comments.textContent = transformLikes(post.comments);
    fetch('http://localhost:3001/users/' + post.userId + '/image')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            userProfile.src = imageUrl;
        });
    fetch('http://localhost:3001/users/' + post.userId + '/nickname')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            userName.textContent = data.nickname;
        });
}

inputComment.addEventListener('input', function () {
    const isEmpty = inputComment.value.trim() === '';
    if (isEmpty) {
        submitCommentButton.disabled = true;
        submitCommentButton.style.backgroundColor = 'rgb(172,160,235)';
    } else {
        submitCommentButton.disabled = false;
        submitCommentButton.style.backgroundColor = 'rgb(127, 106, 238)';
    }
});

submitCommentButton.addEventListener('click', async function () {
    location.reload();
    const { userId, postId } = getUserAndPostIdFromUrl();
    if (submitCommentButton.textContent === '댓글 등록') {
        const data = {
            userId: userId,
            postId: postId,
            content: inputComment.value,
        };
        await fetch(`http://localhost:3001/posts/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } else if (submitCommentButton.textContent === '댓글 수정') {
        console.log(selectedCommentId);
        const data = {
            content: inputComment.value,
            commentId: selectedCommentId,
            postId: postId,
        };
        await fetch('http://localhost:3001/posts/comment', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
});

postModifyButton.addEventListener('click', function () {
    const { userId, postId } = getUserAndPostIdFromUrl();
    window.location.href = `/boardmodify/:${userId}/:${postId}`;
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
function addUserId(event) {
    const { userId, postId } = getUserAndPostIdFromUrl();
    event.preventDefault();
    const href = event.target.getAttribute('href');
    const newUrl = href + '/:' + userId;
    window.location.href = newUrl;
}
