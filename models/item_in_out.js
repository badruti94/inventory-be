'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item_in_out extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      item_in_out.belongsTo(models.user, {
        as: 'user',
        foreignKey: 'user_id'
      })

      item_in_out.belongsTo(models.item, {
        as: 'item',
        foreignKey: 'item_id'
      })
    }
  }
  item_in_out.init({
    proof_code: DataTypes.STRING,
    type: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    stock_after: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'item_in_out',
  });
  return item_in_out;
};