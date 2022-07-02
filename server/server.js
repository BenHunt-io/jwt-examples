import http from 'http';


const server = http.createServer((req, res) => {

    res.statusCode = 200;
    res.end();
})

server.listen(4000, () => {
    console.log("server running at port 4000");
})
