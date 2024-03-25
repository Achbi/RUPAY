const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require("../ROUTES/router")
const cors = require('cors');
app.use(cors());




// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/api/vi",router);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


