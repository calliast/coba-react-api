'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phonebook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Phonebook.init({
    name: DataTypes.STRING,
    phone: DataTypes.NUMERIC
  }, {
    sequelize,
    modelName: 'Phonebook',
  });
  return Phonebook;
};