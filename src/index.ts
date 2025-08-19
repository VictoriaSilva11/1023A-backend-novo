import 'dotenv/config'
console.log(process.env.DBUSER)

import express from 'express';
const app = express()

app.get('/', (req, res) => {
    res.send(process.env.DBUSER);
});
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});