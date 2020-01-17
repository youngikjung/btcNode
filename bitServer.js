const express = require('express');
const app = express();

const server = app.listen(3300, () => {
    console.log("Express server has started on port 3300");
});

const router = require("./router/main")(app);