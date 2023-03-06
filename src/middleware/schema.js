var multer = require("multer");

var path = require("path");

var storage = multer.diskStorage({
    destination : function ( req , file , cb ){
        cb(null, path.join(__dirname, '../../public'))
    },
    filename : function (req, file , cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.originalname + '--' + Date.now());
        cb(null,uniqueSuffix);
    }
}) 

var upload = multer({ storage : storage })

module.exports = { upload };
