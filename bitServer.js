'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3300, () => {
    console.log("Express server has started on port 3300");
});

const router = require("./router/main")(app);