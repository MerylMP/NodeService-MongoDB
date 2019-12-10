const userFunctions = require('./user');

// Database
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'users_NodeMongoDB';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// urls
const querystring = require('querystring');

// Server configuration
const http = require('http');
const port = 3000;
const server = http.createServer((request, response) => {
    const { headers, method, url } = request;
    console.log('headers: ', headers);
    console.log('method: ', method);
    console.log('url: ', url);

    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {

        body = Buffer.concat(body).toString();
        console.log('body: ', body);
        var parsed = querystring.parse(body);

        const document = {
            "name": parsed.name,
            "phone": parsed.phone
        };

        // Conectar el cliente al servidor
        client.connect()
        .then(async () => {
            console.log("Conectado con éxito al servidor");
            const db = client.db(dbName);

            if (request.method === 'POST') {
                userFunctions.insertDocument(db, document, function (err, result) {
                    if (!err) {
                        console.log("Inserción realizada");
                    }
                });
            }

            userFunctions.findDocuments(db, function (err, result) {
                if (!err) {
                    console.log("Documentos correctamente recuperados");
                }

                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                response.end(JSON.stringify(result));
            });
        })
        .catch((error) => {
            console.log("Se produjo algún error en las operaciones con la base de datos: " + error);
                  response.statusCode = 500;
                  response.setHeader('Content-Type', 'text/plain');
                  response.end('Ha habido un error');
        })
    });
})
server.listen(port, () => {
    console.log('Servidor ejecutándose...');
    console.log('Abrir en un navegador http://localhost:3000');
});