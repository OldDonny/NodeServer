var express = require("express");
var bp= require('body-parser');
var path= require('path')
var fs=require('fs');
var shortid= require('short-id');


const datapath= path.join(__dirname ,"data.json")
const app= express();


app
.disable('x-powered-by')
.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, UPDATE, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    next();
})

.use(bp.json())
.use(bp.urlencoded({ extended: true }));


app.route('/api/chirps')

    .get((req, res ) => {
        res.sendFile(datapath)
    })

    .post( (req, res) => {
        fs.readFile(datapath, 'utf-8',(err, cont) => {
            const p= JSON.parse(cont);
            const b = req.body;
            const id= shortid.generate();
            b.id = id;
            p.push(b);
            fs.writeFile(datapath, JSON.stringify(p), (err) => {
                if(err) throw err;
                res.status(201).send(id).end();
            });

        });
    }) ;

app.route('/api/chirps/:id')


    .get((req, res) => {
        fs.readFile(datapath, 'utf-8', (err, cont) => {
            const p= JSON.parse(cont)
            const found= p.filter ((chirp) => {
                return chirp.id === req.params.id
            });
            if(found.length!== 1){
                res.status(404).end();
                return;
            }
            var chirp= JSON.stringify(found[0]);
            res.send(chirp).end();

        })
    })

    .delete((req, res, next) => {
        fs.readFile(datapath, 'utf-8', (err, cont) => {
            const p= JSON.parse(cont)
            var found= -1;
            p.map((chirp, i) => {
                if (chirp.id === req.params.id){
                    found = i;
                }
            });
            if(found === -1){
                res.status(404).end();
                return;
            }
            p.splice(found, 1);
            fs.writeFile(datapath, JSON.stringify(p),'utf-8', (err) => {
                if(err) throw (err);
                res.status(202).sendFile(datapath);
                
            });
        });
    });

    



 app.listen(3000, () => {
     console.log('Hey fool! we is listening on port 300')
 })   