let express = require('express');
let router = express.Router();
let GaleriaModel = require('../model/galeria/GaleriaModel');
let RespostaClass = require('../model/RespostaClass');

let fs = require('fs');
let pastaPublica = "./public/imagens/";

router.get("/", (req, resp, next) => {
    GaleriaModel.getTodos((erro, retorno) => {
        let resposta = new RespostaClass();

        if(erro) {
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro.";
        } else {
            resposta.dados = retorno;
        }

        resp.json(resposta);
    });
});

router.get("/:id?", (req, resp, next) => {
    GaleriaModel.getId(req.params.id, (erro, retorno) => {
        let resposta = new RespostaClass();

        if(erro) {
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro.";
        } else {
            resposta.dados = retorno;
        }

        resp.json(resposta);
    });
});

router.post("/?", (req, resp, next) => {

    let resposta = new RespostaClass();

    //salvar a imagem
    let bitmap = new Buffer.from(req.body.dados_imagem.imagem_base64, 'base64');

    let dataAtual = new Date().toLocaleString().replace(/\//g, '').replace(/:/g, '')
    .replace(/-/g, '').replace(/ /g, '');
    let nomeImagemCaminho = pastaPublica + dataAtual + req.body.dados_imagem.nome_arquivo;
    fs.writeFileSync(nomeImagemCaminho, bitmap);
    req.body.caminho = nomeImagemCaminho

    //verificando se recebeu uma imagem
    if(req.body.dados_imagem != null) {
        GaleriaModel.adicionar(req.body, (erro, retorno) => {

            if(erro) {
                resposta.erro = true;
                resposta.msg = "Ocorreu um erro.";
            } else {
                if(retorno.affectedRows > 0) {
                    resposta.msg = "Cadastro realizado com sucesso.";
                } else {
                    resposta.erro = true;
                    resposta.msg = "Não foi possível realizar o cadastro.";
                }
            }
            
            console.log(resposta)
            resp.json(resposta);
        });
    } else {
        resposta.erro = true;
        resposta.msg = 'Não foi enviado uma imagem.';
        console.log('erro: ', resposta.msg);
        resp.json(resposta);
    }
});

module.exports = router;