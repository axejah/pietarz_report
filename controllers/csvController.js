const db = require('../models');
const { uuid } = require('uuidv4');

const CSVReport = db.CSVReport;

const fs = require('fs');
const csv = require('fast-csv');

const upload = async (req, res) => {
  console.log(req.file);
  try {
    if (req.file == undefined) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }

    let csvreports = [];
    let collectionid = uuid();

    let path =
      __basedir + '/resources/static/assets/uploads/' + req.file.filename;

    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw error.message;
      })
      .on('data', (row) => {
        let dataObj = {};

        dataObj.collection = collectionid;
        dataObj.number = row.No;
        dataObj.position = row.Position;
        dataObj.keyword = row.Keyword;
        dataObj.change = row.Change;
        dataObj.difficulty = row['Search Difficulty'];
        dataObj.volume = row['Search Volume'];
        dataObj.url = row.URL;

        csvreports.push(dataObj);
      })
      .on('end', () => {
        CSVReport.bulkCreate(csvreports)
          .then(() => {
            res.status(200).send({
              message:
                'Uploaded the file successfully: ' + req.file.originalname,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: 'Fail to import data into database!',
              error: error.message,
            });
          });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Could not upload the file: ' + req.file.originalname,
    });
  }
};

const getCSVReports = (req, res) => {
  const { collectionId } = req.body;

  if (!collectionId) {
    return res.status(500).json({
      message: 'Please supply a collection ID',
    });
  }

  CSVReport.findAll({
    where: {
      collection: collectionId,
    },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      });
    });
};

const uploadPage = (req, res) => {
  res.render('pages/uploadCsv');
};

module.exports = {
  upload,
  getCSVReports,
  uploadPage,
};
