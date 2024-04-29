const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'signup.html'));
});
app.get('/board/detail/:userId/:postId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'boarddetail.html'));
});
app.get('/boardmodify/:userId/:postId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'boardmodify.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'boardwrite.html'));
});
app.get('/html/infomodify/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'infomodify.html'));
});
app.get('/board/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'board.html'));
});
app.get('/html/pwmodify/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'pwmodify.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
