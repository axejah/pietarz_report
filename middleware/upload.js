const multer = require('multer');

const csvFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.includes('csv')) {
    cb(null, true);
  } else if (file.mimetype.includes('vnd')) {
    cb(null, true);
  } else {
    cb('Only accepting CSV files.', false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/resources/static/assets/uploads/');
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-pietarzReport-${file.originalname}`);
  },
});

var upload = multer({ storage: storage, fileFilter: csvFilter });

module.exports = upload;
