const fs = require("fs");
var stream = require("stream");
const pdfGs = require("./pdfGs.js");
module.exports = {
  async uploadFile(req, res) {
    console.log(req);
    const file = req.files.data.data;
    const name = req.files.data.name;
    const v = req.body.v;
    const tipo = req.files.data.mimetype;
    const tx = await Buffer.from(file);
    const pdf = await pdfFill.pdfResize(tx, v);
    const f = Buffer.from(pdf);
    var readStream = new stream.PassThrough();
    readStream.end(f);
    res.setHeader("Content-Disposition", "attachment; filename=" + name);
    res.setHeader("name-file", name);
    res.setHeader("Content-Type", tipo);
    res.setHeader("Access-Control-Expose-Headers", "name-file");

    readStream.pipe(res);
  },
  async uploadFile2(req, res) {
    try {
      const file = req.files.file[0]  ? req.files.file[0].data   : req.files.file.data;
      const name = req.files.file[0]  ? req.files.file[0].name   : req.files.file.name;

      const v = parseInt(req.body.v);
      if (!Number.isInteger(parseInt(v))) {
        res
          .status(401)
          .send(
            "Taxa de compressão inválida, por favor, selecione um número inteiro"
          );
        return false;
      }

      if (v > 5 || v < 1) {
        res.status(401).send("Taxa de compressão inválida, por favor, selecione um número inteiro");
        return false;
      }
      if (!name || !file) {
        res.status(401).send("Arquivo não enviado, por favor tente novamente");
        return false;
      }
      if (name.substring(name.length, name.length - 3) != "pdf") {
        res.status(401).send("Atenção, somente arquivos com extensão pdf podem ser redimensionados");
        return false;
      } else {
        const tipo = req.files.file[0]  ? req.files.file[0].mimetype : req.files.file.mimetype;
        const tx = await Buffer.from(file); 
        const ip = req.session.ip;
        const chave = req.session.chave;
        const prf = req.session.prefixo;
        const pdf = await pdfGs.pdfResize(tx, name, v - 1, req);
        const original = req.session.original;
        const compacter = req.session.compacted;
        // pool.query(
        //   "insert into AppPdf.log_arquivo (file_name, ip, user, prefixo, size_original, size_compacted) values(?,?,?,?,?,?)",
        //   [name, ip, chave, prf, original, compacter],
          // (error, response) => {
            // if (error) {
            //   console.log(error.toString().substring(0, 5000));
            //   res
            //     .status(500)
            //     .send(
            //       "Houve um erro ao processar sua requisição, por favor tente novamente"
            //     );
            //   throw error;
            // }
            var readStream = new stream.PassThrough();
            readStream.end(pdf);
            res.setHeader("Content-Disposition",   "attachment; filename=resized-" + name  );
            res.setHeader("name-file", "resized-" + name);
            res.setHeader("Content-Type", tipo);
            res.setHeader("Access-Control-Expose-Headers", "name-file");
            readStream.pipe(res);
        //   }
        // );
      }
    } catch (erro) {
      console.log(erro);
      res.status(401).send("Arquivo não enviado, por favor tente novamente");
      return false;
    }
  },
};
