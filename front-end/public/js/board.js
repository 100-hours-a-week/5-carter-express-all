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
            profileImage.src = imageUrl;
        });

    fetch('http://localhost:3001/posts')
        .then(response => response.json())
        .then(data => {
            displayPosts(data);
        })
        .catch(error => console.error('Error fetching posts:', error));
});

function getUserIdFromURL() {
    const url = window.location.href;
    const userIdIndex = url.lastIndexOf('/:');
    if (userIdIndex !== -1) {
        return url.substring(userIdIndex + 2);
    }
    return null;
}

function toggleDropdown() {
    var dropdownContent = document.getElementById('menu-box');
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
    } else {
        dropdownContent.style.display = 'none';
    }
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
function displayPosts(posts) {
    const postContainer = document.getElementById('post-container');

    posts.forEach((post, index) => {
        const container = document.createElement('div');
        container.classList.add('my-box');

        container.postId = post.postId;
        container.style.top = `calc(300px + ${index * 180}px)`;

        const titleId = `${index}title`;
        const likeId = `${index}like`;
        const timeId = `${index}time`;
        const hrId = `${index}hr`;
        const writerId = `${index}writer`;
        // fetch('http://localhost:3001/users/' + userId + '/image')
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.blob();
        //     })
        //     .then(blob => {
        //         const imageUrl = URL.createObjectURL(blob);
        //         const profileImage = document.getElementById('profileImage');
        //         profileImage.src = imageUrl;
        //     });
        post.likes = transformLikes(post.likes);
        post.comments = transformLikes(post.comments);
        post.views = transformLikes(post.views);
        // console.log(profileImage);
        container.innerHTML = `
 <div class="title" id="${titleId}">${post.title}</div>
 <div class="like" id="${likeId}">좋아요 ${post.likes} 댓글 ${post.comments} 조회수 ${post.views}</div>
 <div class="date" id="${timeId}">${post.date}</div>
 <hr id="${hrId}" />
 <div class="author" id="${writerId}">${post.author}</div>
`;
        container.addEventListener('click', function () {
            window.location.href = `boarddetail/:${container.postId}`;
            // console.log(container.postId);
        });
        postContainer.appendChild(container);
    });
}
function addUserId(event) {
    const userId = getUserIdFromURL();

    event.preventDefault();

    const href = event.target.getAttribute('href');

    const newUrl = href + '/:' + userId;

    window.location.href = newUrl;
}
