require('dotenv').config();
const PORT = process.env.PORT || 5000;

const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const db = require('./models');
const backendRoutes = require('./routes/csvreports.routes');
const frontendRoutes = require('./routes/views.routes');

const app = express();

global.__basedir = __dirname;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

backendRoutes(app);
frontendRoutes(app);

db.sequelize.sync();

app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
