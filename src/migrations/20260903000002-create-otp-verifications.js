'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('otp_verifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      otp_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'verified', 'locked'),
        allowNull: false,
        defaultValue: 'pending',
      },
      attempt_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('otp_verifications', ['phone_number']);
    await queryInterface.addIndex('otp_verifications', ['phone_number', 'created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('otp_verifications');
  },
};
