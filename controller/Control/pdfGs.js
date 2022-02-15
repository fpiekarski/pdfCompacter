const { exec } = require("child_process");
var fs = require("fs");
const path = require('path');
const { stdout, stderr } = require("process");
module.exports = {
  async pdfResize(rpdf, nome,v, req) {
    const Path = path.resolve(__dirname, '../../public/imagens')
    const rename = nome.replace(/[&\/\\#,+$~%()'":*?<>{}\s]/g,"_")
    const writer = fs.writeFileSync(Path +"/"+ rename, rpdf)
    var o = fs.statSync(Path +"/"+ rename)
    console.log("awaui",o['size'])
    req.session.original = o['size']
    return new Promise(async (resolve, reject) => {
      const opt = ["default","prepress","printer","ebook","screen" ]
      const s = opt[v]
      console.log("aqui o v",s)
      const file = rename
      const nameFile = rename
      exec(`gs -sDEVICE=pdfwrite -dPDFSETTINGS=/${s}  -q  -o ${Path}/resized-${nameFile} ${Path+"/"+file}`,async (error,stdout,stderr)=>{
        //console.log(error,stdout,stderr)
        const r = await fs.readFileSync(`${Path}/resized-${nameFile}`,(a)=>(a))
        var o = fs.statSync(Path +"/resized-"+ rename)
        req.session.compacted = o['size']
        resolve(r)
      })
    });
  },
};
