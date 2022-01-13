module.exports = (sequelize, Sequelize) => {
  const CSVReport = sequelize.define('csvreport', {
    collection: {
      type: Sequelize.STRING,
    },
    number: {
      type: Sequelize.INTEGER,
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    keyword: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    change: {
      type: Sequelize.STRING,
    },
    difficulty: {
      type: Sequelize.STRING,
    },
    volume: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
  });

  return CSVReport;
};
