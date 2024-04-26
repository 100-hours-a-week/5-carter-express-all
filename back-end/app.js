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
app.post('/posts', upload.single('file'), (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return;
        }
        try {
            jsonData = JSON.parse(data);
            const postId = jsonData.posts.length;

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
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            const newPost = {
                postId: postId,
                title: req.body.title,
                date: formattedDate,
                likes: 0,
                comments: 0,
                views: 0,
                author: 'carter',
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

app.post('/users/signup', upload.single('file'), (req, res) => {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading data.json file:', err);
            return;
        }
        try {
            jsonData = JSON.parse(data);
            const userId = jsonData.users.length;
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
