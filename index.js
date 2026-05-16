const express = require('express');
const request = require('request');
const wikip = require('wiki-infobox-parser');
###########fix##########
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const app = express();
app.use(cookieParser());
app.use(csrf({ cookie: true }));
########################
//ejs
app.set("view engine", 'ejs');

//routes
app.get('/', (req,res) =>{
    res.render('index');
});

app.get('/index', (req,response) =>{
    let url = "https://en.wikipedia.org/w/api.php"
    let params = {
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    }

    url = url + "?"
    Object.keys(params).forEach( (key) => {
        url += '&' + key + '=' + params[key]; 
    });

    //get wikip search string
    request(url,(err,res, body) =>{
        if(err) {
            response.redirect('404');
        }
            const result = JSON.parse(body);              #fix
            let x = result[3][0];                         #sonarqube_smell_code_fix
            x = x.substring(30, x.length); 
            //get wikip json
            wikip(x , (err, final) => {
                if (err){
                    response.redirect('404');
                }
                else{
                    const answers = final;
                    response.send(answers);
                }
            });
    });

    
});

//port
app.listen(3000, console.log("Listening at port 3000..."))
