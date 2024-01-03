const server = require('./api/apps');

server.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT)
});