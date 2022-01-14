const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvController');
const upload = require('../middleware/upload');

let routes = (app) => {
  router.post('/upload', upload.single('csvReport'), csvController.upload);
  router.get('/csvreports', csvController.getCSVReports);
  router.get('/getReportData/:collectionId', csvController.getReportData);

  app.use('/api/csv', router);
};

module.exports = routes;