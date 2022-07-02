const port=3000;
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('comhome_server');
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});