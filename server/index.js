const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', socket => {
    
})

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
})