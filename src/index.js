require('dotenv').config();
const express = require('express');
const cors = require('cors');

const Db = require('./models');
// const Seeder = require('./seeders');

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', require('./routes'));

app.listen(process.env.PORT, async () => {

    await Db.sync();

    // ejecuta un create-drop para limpiar todas las tablas
    // await Db.sync({force:true});

    // llena las tablas con informacion
    // await Seeder();

// console.log(`Application running on port: ${process.env.PORT}`);
});