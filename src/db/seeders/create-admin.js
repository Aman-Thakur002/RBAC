'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      
      // Dynamically import the hashPassword function
      const { hashPassword } = await import('../../utility/password-hash.js');
      
      const hashedPassword = await hashPassword('123456789'); // Hash the password

      await queryInterface.bulkInsert('Users', [
        {
          name: 'Admin👀',
          email: 'admin@admin.com',
          password: hashedPassword,
          otp: null,
          phoneNumber: 12312323,
          role: 'Admin',
          type: 'Admin',
          verified: true,
          status: 'Active',
          accessToken: null,
          lastLogin: null,
          createdBy: 'Admin',
          updatedBy: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ]);
    } catch (error) {
      console.error('Error in seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete(
        'Users',
        {
          email: 'admin@admin.com',
        },
        {}
      );
    } catch (error) {
      console.error('Error in reverting seeder:', error);
      throw error;
    }
  },
};
