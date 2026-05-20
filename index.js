const express = require('express');
const request = require('request');
const wikip = require('wiki-infobox-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf'); 
const app = express();
app.use(cookieParser());
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

//ejs
app.set("view engine", 'ejs');

//routes
app.get('/', (req,res) =>{
    // Truyền csrfToken vào view để gắn vào các form (nếu có)
    res.render('index', { csrfToken: req.csrfToken() });
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
            result = JSON.parse(body);
            x = result[3][0];
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