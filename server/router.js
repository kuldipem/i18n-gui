var JSZip = require("jszip");

module.exports=router=(app)=>{
    app.post('/api/export', function (req, res) {
       
        const langs=JSON.parse(req.body.langs);
        const keys=JSON.parse(req.body.keys);
        const fileData={};
        const zip = new JSZip();
        
        langs.forEach((lang)=>{
            fileData[lang]={};
            keys.forEach((key)=>{
                fileData[lang][`${key.id}`]=(key.translations.find((x)=>x.lang===lang).text)
            });
            
        });
        
        for (var fileName in fileData) {
            if (fileData.hasOwnProperty(fileName)) {
                console.log(fileData[fileName]);
              zip.file(`${fileName}.json`,`${JSON.stringify(fileData[fileName],null, 2)}`);
            }
        }

        zip
        .generateAsync({type:"base64"})       
        .then(function (content) {
            res.send(content);
        });
    });
};

