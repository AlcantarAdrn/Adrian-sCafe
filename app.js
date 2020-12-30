var http = require('http'),
    path = require('path'),
    express = require('express'),
    fs = require ('fs'),
    xmlParse = require('xslt-processor').xmlParse,
    xsltProcess = require('xslt-processor').xsltProcess,
    xml2js = require('xml2js');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views')));
router.use(express.urlencoded({extended:true}));
router.use(express.json());

function xmlFileToJs(filename, cb){
var filepath = path.normalize(path.join(__dirname,filename));
fs.readFile(filepath, 'utf8', function(err,xmlStr) {
    if(err) throw(err);
    xml2js.parseString(xmlStr, {}, cb);

});
}

function jsToXmlFile(filename, obj,cb){
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);

}

router.get('/', function(req,res) {
    res.render('index');

});

router.get('/get/html', function(req,res) {

    res.writeHead(200, {'Content-Type': 'text/html'});

    var xml = fs.readFileSync('AdriansRecords.xml', 'utf8');
    var xsl = fs.readFileSync('AdriansRecords.xsl', 'utf8');

    var doc = xmlParse(xml);
    var stylesheet = xmlParse(xsl);

    var result = xsltProcess(doc, stylesheet);

    res.end(result.toString());
});

router.post('/post/json', function (req,res){

    function appendJSON(obj)

    xmlFileToJs('AdriansRecords.xml', function (err, result) {
        if(err) throw (err);
        result.recordsmenu.section[obj.sec_n].entree.push({'item' : obj.item, 'price': obj.price});

        console.log(JSON.stringify(result, null, " "));

        jsToXmlFile('AdriansRecords.xml', result, function(err){
            if(err) console.log(err);
        });
    });
};

appendJSON(req.body)
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Server listnening at", addr.address + ":" + addr.port);
});