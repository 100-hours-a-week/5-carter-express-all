const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const app = express();
const jsonFilePath = path.join(__dirname, 'models', 'data.json');
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(logJsonFilePath);
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });
const uploadPath = path.join(__dirname, 'uploads/');
app.post('/posts/register', upload.single('file'), (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return;
        }
        try {
            jsonData = JSON.parse(data);
            const postId = jsonData.posts.reduce((max, post) => {
                return Math.max(max, post.postId) + 1;
            }, 0);

            let newFileName = null;
            if (req.file) {
                newFileName = `post${postId}${path.extname(req.file.originalname)}`;
                fs.rename(
                    uploadPath + req.file.originalname,
                    uploadPath + newFileName,
                    err => {
                        if (err) {
                            console.log('Error renaming file:', err);
                            return;
                        }
                        console.log('File uploaded successfully');
                        return;
                    },
                );
            }

            const newPost = {
                postId: postId,
                title: req.body.title,
                date: getDate(),
                likes: 0,
                comments: 0,
                views: 0,
                userId: req.body.userId,
                image: newFileName,
                content: req.body.content,
                reply: [],
            };
            jsonData.posts.push(newPost);
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return;
                    }
                    console.log('New post added successfully');
                    return;
                },
            );
        } catch (parseError) {
            console.log('에러');
            return;
        }
    });
});
function logJsonFilePath(req, res, next) {
    console.log('Request received for:', jsonFilePath);
    next(); // 다음 미들웨어 함수로 요청을 전달
}

app.get('/posts', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return;
        }
        res.json(JSON.parse(data).posts);
    });
});

app.get('/posts/:postId/image', (req, res) => {
    const postId = req.params.postId;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return;
        }
        try {
            const posts = JSON.parse(data).posts;
            const postIndex = posts.findIndex(post => post.postId == postId);
            const imagePath = posts[postIndex].image;
            return res.sendFile(uploadPath + imagePath);
        } catch (parseError) {
            console.error('Error parsing data.json:', parseError);
            return res.sendStatus(500);
        }
    });
});

app.post('/users/signup', upload.single('file'), (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return;
        }
        try {
            jsonData = JSON.parse(data);
            const userId = jsonData.users.reduce((max, user) => {
                return Math.max(max, user.userId) + 1;
            }, 0);
            const newFileName = `user${userId}${path.extname(req.file.originalname)}`;
            fs.rename(
                uploadPath + req.file.originalname,
                uploadPath + newFileName,
                err => {
                    if (err) {
                        console.log('Error renaming file:', err);
                        return;
                    }
                    console.log('File uploaded successfully');
                    return;
                },
            );
            const newUser = {
                email: req.body.email,
                nickname: req.body.nickname,
                password: req.body.password,
                userId: userId,
                imagePath: newFileName,
            };
            jsonData.users.push(newUser);
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return;
                    }
                    console.log('New post added successfully');
                    return;
                },
            );
        } catch (error) {
            console.log('error', error);
            return;
        }
    });
});

app.post('/users/login', (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        const users = JSON.parse(data).users;
        const email = req.body.email;
        const password = req.body.password;

        for (let i = 0; i < users.length; i += 1) {
            const user = users[i];
            if (email === user.email && password === user.password) {
                return res.status(200).json({ userId: user.userId });
            }
        }
        return res.status(401).send('잘못된 이메일 또는 비밀번호입니다.');
    });
});

app.get('/posts/:postId/comment', (req, res) => {
    const postId = req.params.postId;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        const jsonData = JSON.parse(data);
        const postIndex = jsonData.posts.findIndex(
            post => post.postId == postId,
        );
        return res.json(jsonData.posts[postIndex].reply);
    });
});

app.post('/posts/comment', (req, res) => {
    const { postId, userId, content } = req.body;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        const jsonData = JSON.parse(data);
        const postIndex = jsonData.posts.findIndex(
            post => post.postId == postId,
        );
        const commentId = jsonData.posts[postIndex].reply.reduce(
            (max, reply) => {
                return Math.max(max, reply.commentId) + 1;
            },
            0,
        );
        const newComment = {
            commentId: commentId,
            userId: parseInt(userId),
            date: getDate(),
            content: content,
        };
        jsonData.posts[postIndex].reply.push(newComment);
        fs.writeFile(
            jsonFilePath,
            JSON.stringify(jsonData, null, 2),
            'utf8',
            err => {
                if (err) {
                    console.log('Error writing data.json file:', err);
                    return;
                }
                console.log('New post added successfully');
                return;
            },
        );
    });
});

app.patch('/posts/comment', (req, res) => {
    const { content, commentId, postId } = req.body;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        const jsonData = JSON.parse(data);
        const postIndex = jsonData.posts.findIndex(
            post => post.postId == postId,
        );
        const commentIndex = jsonData.posts[postIndex].reply.findIndex(
            rep => rep.commentId == commentId,
        );
        jsonData.posts[postIndex].reply[commentIndex].content = content;
        jsonData.posts[postIndex].reply[commentIndex].date = getDate();
        fs.writeFile(
            jsonFilePath,
            JSON.stringify(jsonData, null, 2),
            'utf8',
            err => {
                if (err) {
                    console.log('Error writing data.json file:', err);
                    return;
                }
                console.log('New post added successfully');
                return;
            },
        );
    });
});

app.get('/users/:userId/image', (req, res) => {
    const userId = req.params.userId;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            const users = JSON.parse(data).users;
            for (let i = 0; i < users.length; i += 1) {
                const user = users[i];
                if (user.userId == userId) {
                    return res.sendFile(uploadPath + user.imagePath);
                }
            }
            res.sendStatus(404);
        } catch (parseError) {
            console.error('Error parsing data.json:', parseError);
            return res.sendStatus(500);
        }
    });
});

app.get('/users/:userId/nickname', (req, res) => {
    const userId = req.params.userId;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            const users = JSON.parse(data).users;
            for (let i = 0; i < users.length; i += 1) {
                const user = users[i];
                if (user.userId == userId) {
                    return res.status(200).json({ nickname: user.nickname });
                }
            }
            res.sendStatus(404);
        } catch (parseError) {
            console.error('Error parsing data.json:', parseError);
            return res.sendStatus(500);
        }
    });
});
app.get('/users/isDuplicate/:nickname', (req, res) => {
    const nickname = req.params.nickname;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            jsonData = JSON.parse(data);
            const users = jsonData.users;
            const isDuplicate = users.some(user => user.nickname === nickname);
            return res.status(200).json({ isDuplicate: isDuplicate });
        } catch (err) {
            return res.sendStatus(500);
        }
    });
});

app.patch('/users/info/:userId', upload.single('file'), (req, res) => {
    const userId = req.params.userId;
    const formData = req.body;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            jsonData = JSON.parse(data);
            let newFileName;
            if (req.file) {
                newFileName = `user${userId}${path.extname(req.file.originalname)}`;
                fs.rename(
                    uploadPath + req.file.originalname,
                    uploadPath + newFileName,
                    err => {
                        if (err) {
                            console.log('Error renaming file:', err);
                            return;
                        }
                        console.log('File uploaded successfully');
                        return;
                    },
                );
            }
            const users = jsonData.users;
            for (let i = 0; i < users.length; i += 1) {
                let user = users[i];
                // console.log(user.userId);
                if (user.userId == userId) {
                    if (req.file) {
                        fs.rename(
                            uploadPath + req.file.originalname,
                            uploadPath + newFileName,
                            err => {
                                if (err) {
                                    console.log('Error renaming file:', err);
                                    return;
                                }
                                console.log('File uploaded successfully');
                                return;
                            },
                        );
                    } else {
                        newFileName = users[i].imagePath;
                    }
                    jsonData.users[i].nickname = formData.nickname;
                    jsonData.users[i].imagePath = newFileName;
                }
            }
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return;
                    }
                    console.log('Info modified successfully');
                    return;
                },
            );
        } catch (err) {
            return res.sendStatus(500);
        }
    });
});

app.delete('/users', (req, res) => {
    const userId = req.body.userId;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            jsonData = JSON.parse(data);
            const users = jsonData.users;
            const userIndex = users.findIndex(user => user.userId == userId);
            if (userIndex === -1) {
                return res
                    .status(404)
                    .json({ message: '해당 사용자를 찾을 수 없습니다.' });
            }
            jsonData.users.splice(userIndex, 1);
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return res.status(400).json({ message: 'failed' });
                    }
                    console.log('Info modified successfully');
                    return res.status(200).json({ message: 'success' });
                },
            );
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    });
});

app.delete('/posts', (req, res) => {
    const postId = req.body.postId;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            jsonData = JSON.parse(data);
            const posts = jsonData.posts;
            const postIndex = posts.findIndex(post => post.postId == postId);
            if (postIndex === -1) {
                return res
                    .status(404)
                    .json({ message: '해당 사용자를 찾을 수 없습니다.' });
            }
            jsonData.posts.splice(postIndex, 1);
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return res.status(400).json({ message: 'failed' });
                    }
                    console.log('Info modified successfully');
                    return res.status(200).json({ message: 'success' });
                },
            );
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    });
});

app.delete('/posts/comment', (req, res) => {
    const { commentId, postId } = req.body;
    console.log(postId, commentId);
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            jsonData = JSON.parse(data);
            const postIndex = jsonData.posts.findIndex(
                post => post.postId == postId,
            );
            const commentIndex = jsonData.posts[postIndex].reply.findIndex(
                reply => reply.commentId == commentId,
            );
            jsonData.posts[postIndex].reply.splice(commentIndex, 1);
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return res.status(400).json({ message: 'failed' });
                    }
                    console.log('Info modified successfully');
                    return res.status(200).json({ message: 'success' });
                },
            );
        } catch (err) {
            return res.status(400);
        }
    });
});

app.patch('/users/pw', (req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            jsonData = JSON.parse(data);
            const users = jsonData.users;
            const userIndex = users.findIndex(user => user.userId == userId);
            if (userIndex === -1) {
                return res
                    .status(404)
                    .json({ message: '해당 사용자를 찾을 수 없습니다.' });
            }
            jsonData.users[userIndex].password = password;
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return res.status(400).json({ message: 'failed' });
                    }
                    console.log('Info modified successfully');
                    return res.status(200).json({ message: 'success' });
                },
            );
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    });
});

app.patch('/posts', upload.single('file'), (req, res) => {
    const postId = req.body.postId;
    const title = req.body.title;
    const content = req.body.content;
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return res.sendStatus(500);
        }
        try {
            jsonData = JSON.parse(data);
            const posts = jsonData.posts;
            const postIndex = posts.findIndex(post => post.postId == postId);
            if (postIndex === -1) {
                return res
                    .status(404)
                    .json({ message: '해당 사용자를 찾을 수 없습니다.' });
            }
            let newFileName = jsonData.posts[postIndex].image;
            if (req.file) {
                newFileName = `post${postId}${path.extname(req.file.originalname)}`;
                fs.rename(
                    uploadPath + req.file.originalname,
                    uploadPath + newFileName,
                    err => {
                        if (err) {
                            console.log('Error renaming file:', err);
                            return;
                        }
                        console.log('File uploaded successfully');
                        return;
                    },
                );
            }
            jsonData.posts[postIndex].title = title;
            jsonData.posts[postIndex].content = content;
            jsonData.posts[postIndex].title = title;
            jsonData.posts[postIndex].imagePath = newFileName;
            fs.writeFile(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                'utf8',
                err => {
                    if (err) {
                        console.log('Error writing data.json file:', err);
                        return res.status(400).json({ message: 'failed' });
                    }
                    console.log('Info modified successfully');
                    return res.status(200).json({ message: 'success' });
                },
            );
        } catch (err) {
            return res.status(400);
        }
    });
});
// app.get('/posts', (req, res) => {});
// app.get('/data.json', (req, res) => {
//     console.log(123);
// console.log(jsonFilePath);

// fs.readFile(jsonFilePath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading file:', err);
//         res.status(500).send('Internal Server Error');
//         return;

//         let jsonData;
//         try {
//             jsonData = JSON.parse(data);
//         } catch (parseError) {
//             console.error('Error parsing JSON:', parseError);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//     }
//     res.json(jsonData);
// });
//     res.sendFile(jsonFilePath);
// });

// app.post('/users/signup', (req, res) => {
//     const userData = req.body;

//     fs.readFile('/models/data.json', (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         let jsonData = [];
//         if (data.length !== 0) {
//             jsonData = JSON.parse(data);
//         }

//         jsonData.users.push(userData);
//         fs.writeFile(
//             '/models/data.json',
//             JSON.stringify(jsonData, null, 2),
//             'utf8',
//             err => {
//                 if (err) {
//                     console.error(err);
//                     res.status(500).send('Internal Server Error');
//                     return;
//                 }

//                 res.status(200).send('User registered successfully!');
//             },
//         );
//     });
// });
function getDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
