const express = require('express');
const request = require('request');
const wikip = require('wiki-infobox-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf'); 
const helmet = require('helmet');
const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(cookieParser());
// Kiểm tra xem server có đang chạy trên môi trường thực tế (production) không
const isProduction = process.env.NODE_ENV === 'production';

const csrfProtection = csurf({ 
    cookie: { 
        secure: isProduction, // Bật cờ an toàn HTTPS khi deploy lên server thật
        httpOnly: true,       // Ngăn hacker dùng mã độc JavaScript (XSS) để đọc trộm cookie
        sameSite: 'strict'    // Quy định cookie chỉ được gửi từ chính domain của bạn
    } 
});
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