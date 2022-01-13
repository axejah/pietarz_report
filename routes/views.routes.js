const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvController');

let routes = (app) => {
  router.get('/', csvController.uploadPage);

  app.use('/', router);
};

module.exports = routes;
