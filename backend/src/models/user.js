const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      underscored: true,
    }
  );

  User.prototype.toProfile = function toProfile() {
    return {
      id: this.id,
      phone_number: this.phone_number,
      name: this.name,
      profile_image: this.profile_image,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  return User;
};
