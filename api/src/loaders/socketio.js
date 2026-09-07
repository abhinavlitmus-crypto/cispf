const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

module.exports = ({ server }) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            // allowedHeaders: ["my-custom-header"],
            credentials: true,
        },
    });
    global.socketEmitter = emitter;

};