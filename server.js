const express = require("express");
const app = express();
// const routes = require("./routes");
const PORT = process.env.PORT || 3001;

//express parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

//uses the route information on "routes/index.js"
// app.use(routes);
require("./routes/apiRoutes")(app);

// start server; react is listening on 3000, so need to use 3001
app.listen(PORT, () => console.log(`API Server now listening on PORT ${PORT}!`));