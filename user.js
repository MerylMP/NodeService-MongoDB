module.exports = {

    // INSERT
    insertDocument: function (db, document, callback) {

        const collection = db.collection('usuarios');
        collection.insertOne(document, function (err, result) {
            if (err) {
                console.log("Error insertando documento: ", err);
            }
            callback(err, result);
        });
    },


    // RECOVER
    findDocuments: function (db, callback) {

        const collection = db.collection('usuarios');
        collection.find({}).toArray(function (err, docs) {
            if (err) {
                console.log("Error recuperando documentos: ", err);
            }
            callback(err, docs);
        });
    }
}  