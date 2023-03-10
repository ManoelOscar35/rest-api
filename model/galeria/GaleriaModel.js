const db = require('../../banco/dbConexao');

module.exports = class GaleriaModel {

    static getTodos(callback) {
        return db.query("SELECT * FROM galeria", callback);
    }

    static getId(id, callback) {
        return db.query("SELECT * FROM galeria WHERE id_galeria = ?", [id], callback);
    }

    static adicionar(dados, callback) {
        return db.query("INSERT INTO galeria(titulo, caminho)VALUES(?, ?)", [dados.titulo, dados.caminho], callback);
    }
}

