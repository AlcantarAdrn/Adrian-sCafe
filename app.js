var http = require('http'),
    path = require('path'),
    express = require('express'),
    fs = require ('fs'),
    xmlParse = require('xslt-processor').xmlParse,
    xsltProcess = require('xslt-processor').xsltProcess;

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views')));
router.use(express.urlencoded({extended:true}));


router.get('/get/html', function(req,res) {

    res.writeHead(200, {'Content-Type': 'text/html'});

    var xml = fs.readFileSync('AdriansRecords.xml', 'utf8');
    var xsl = fs.readFileSync('AdriansRecords.xsl', 'utf8');

    var doc = xmlParse(xml);
    var stylesheet = xmlParse(xsl);

    var result = xsltProcess(doc, stylesheet);

    res.end(result.toString());
});
