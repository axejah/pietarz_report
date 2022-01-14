const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvController');

let routes = (app) => {
  router.get('/', csvController.uploadPage);
  router.get('/report/:collectionId', csvController.generateReport);

  app.use('/', router);
};

module.exports = routes;