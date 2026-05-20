const express = require('express');
const app = express();

const request = require('request');
const wikip = require('wiki-infobox-parser');

// CSRF protection
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(csrf({ cookie: true }));
app.use((req, res, next) => {
    try {
        res.locals.csrfToken = req.csrfToken();
    } catch (e) {}
    next();
});

// ejs
app.set("view engine", 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', (req, response) => {

    let url = "https://en.wikipedia.org/w/api.php";

    let params = {
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    };

    url = url + "?";

    Object.keys(params).forEach((key) => {
        url += '&' + key + '=' + params[key];
    });

    // get wikipedia search string
    request(url, (err, res, body) => {

        if (err) {
            return response.redirect('404');
        }

        let result = JSON.parse(body);

        if (!result[3] || !result[3][0]) {
            return response.redirect('404');
        }

        let x = result[3][0];
        x = x.substring(30, x.length);

        // get wikipedia json
        wikip(x, (err, final) => {

            if (err) {
                return response.redirect('404');
            }

            const answers = final;
            response.send(answers);
        });
    });
});

// port
app.listen(3000, () => {
    console.log("Listening at port 3000...");
});
