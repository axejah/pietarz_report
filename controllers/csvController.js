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
            return res.status(200).render('pages/uploadSucces', {
              collectionid,
              rows: csvreports.length,
            });
            // res.status(200).send({
            //   message:
            //     'Uploaded the file successfully: ' + req.file.originalname,
            //   collectionId,
            //   rows: csvreports.length,
            // });
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
        message: err.message || 'Some error occurred while retrieving report.',
      });
    });
};

const uploadPage = (req, res) => {
  res.render('pages/uploadCsv');
};

const generateReport = (req, res) => {
  const { collectionId } = req.params;

  if (!collectionId) {
    return res.status(400).json({ message: 'no collectionId supplied' });
  }
  CSVReport.findAll({
    where: {
      collection: collectionId,
    },
  })
    .then((data) => {
      let keywordLabel = [];
      let rankValue = [];
      let rankChange = [];
      let rankDifficulty = [];
      let rankVolume = [];
      let rankUrl = [];

      data.map((obj) => {
        keywordLabel.push(obj.keyword);
        rankValue.push(obj.position);
        rankChange.push(obj.change);
        rankDifficulty.push(obj.difficulty);
        rankVolume.push(obj.volume);
        return rankUrl.push(obj.url);
      });

      let arrayOfObj = keywordLabel.map((d, i) => {
        return {
          label: d,
          positionData: rankVolume[i] || 0,
          changeData: rankChange[i] || 0,
          difficultyData: rankDifficulty[i] || 0,
          volumeData: rankVolume[i] || 0,
        };
      });

      let sortedVolumeData = arrayOfObj.sort(function (a, b) {
        return b.volumeData - a.volumeData;
      });

      let volumeLabel = [];
      let volumeData = [];

      sortedVolumeData.forEach(function (d) {
        volumeLabel.push(d.label);
        volumeData.push(d.volumeData);
      });

      let sortedPositionData = arrayOfObj.sort(function (a, b) {
        return b.positionData - a.positionData;
      });

      let positionLabel = [];
      let positionData = [];

      sortedPositionData.forEach(function (d) {
        positionLabel.push(d.label);
        positionData.push(d.positionData);
      });

      let sortedDifficultyData = arrayOfObj.sort(function (a, b) {
        return a.difficultyData - b.difficultyData;
      });

      let difficultyLabel = [];
      let difficultyData = [];

      sortedDifficultyData.forEach(function (d) {
        difficultyLabel.push(d.label);
        difficultyData.push(d.difficultyData);
      });

      const returnObj = {
        unsortedData: {
          keywordLabel,
          rankValue,
          rankChange,
          rankDifficulty,
          rankVolume,
          rankUrl,
        },
        sortedData: {
          byPosition: {
            positionLabel,
            positionData,
          },
          byVolume: {
            volumeLabel,
            volumeData,
          },
          byDifficulty: {
            difficultyLabel,
            difficultyData,
          },
        },
      };

      return res.render('pages/report', { returnObj });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || 'Some error occurred while retrieving report.',
      });
    });
};

module.exports = {
  upload,
  getCSVReports,
  uploadPage,
  generateReport,
};
