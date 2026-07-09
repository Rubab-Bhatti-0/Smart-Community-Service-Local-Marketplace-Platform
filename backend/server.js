require('dotenv').config()
const http = require('http');
const { Server } = require('socket.io');
const getConnection=require('./config/db/db')
const PORT=process.env.PORT || 5000
const app=require('./src/App')

getConnection()

const server = http.createServer(app); 
const io = new Server(server, {
  cors: { origin: '*' } 
});

require('./sockets/chatSocket')(io); 


server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 