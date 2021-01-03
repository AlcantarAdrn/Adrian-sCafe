var http = require('http'), //http dependencie in order to process http request.
    path = require('path'), 
    express = require('express'),
    fs = require ('fs'), //Filesystem that handles the tree file system.
    xmlParse = require('xslt-processor').xmlParse,
    xsltProcess = require('xslt-processor').xsltProcess,
    xml2js = require('xml2js'); //Xml to Json dependency to convert back and forth.



var router = express(); //Our router will be handled by the express dependency.
var server = http.createServer(router); //And the server is created by the http dependency.

router.use(express.static(path.resolve(__dirname, 'views'))); //We also need a static path that directs to the views.
router.use(express.urlencoded({extended:true}));
router.use(express.json()); 

function xmlFileToJs(filename, cb){  //Function to go from xml to json 
var filepath = path.normalize(path.join(__dirname,filename));
fs.readFile(filepath, 'utf8', function(err,xmlStr) {
    if(err) throw(err);
    xml2js.parseString(xmlStr, {}, cb);

});
}

function jsToXmlFile(filename, obj,cb){ //Function to go from JSON to xml 
    var filepath = path.normalize(path.join(__dirname, filename));
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);

}

router.get('/', function(req,res) {
    res.render('index'); //Function that renders the index file.

});

router.get('/get/html', function(req,res) { 

    res.writeHead(200, {'Content-Type': 'text/html'}); //200 protocol that stablis an OK when the page is reached.

    var xml = fs.readFileSync('AdriansRecords.xml', 'utf8'); //The var xml that reads the "AdrianRecords.xml"
    var xsl = fs.readFileSync('AdriansRecords.xsl', 'utf8'); //Var xsl that reads the "AdrianRecords.xsl".

    var doc = xmlParse(xml); //The doc var that is the parsed of the xml file.
    var stylesheet = xmlParse(xsl); //The internal stylesheet is the xsl file read above.

    var result = xsltProcess(doc, stylesheet); //The result is the doc and the stylesheet put together.

    res.end(result.toString()); //And the result has to sent as string to be displayed in screen.
});

router.post('/post/json', function (req,res){

    function appendJSON(obj){

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
res.redirect('back');
});

router.post('/post/delet', function(req,res){

    function deleteJSON(obj){
        
        console.log(obj)

        xmlFileToJs ('AdriansRecords.xml', function (err,result){
            if(err) throw (err);

            delete result.recordsmenu.section[obj.section].entree[obj.entree];

            console.log(JSON.stringify(result, null, " "));

            jsToXmlFile('AdriansRecords.xml', result, function(err) {
                if (err) console.log(err);

            });
        });

    };

    deleteJSON(req.body);

    res.redirect('back');
})


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () { //The server has to listen to the port 3000
    var addr = server.address(); //The address is stored in the var addr 
    console.log("Server listnening at", addr.address + ":" + addr.port); //And it is send to the console that the port 3000 is listening and shows in browser or preview.
});