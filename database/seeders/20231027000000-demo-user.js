'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    try {
        await queryInterface.bulkInsert('users', [{
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    } catch (e) {
        console.log('User might already exist, skipping insert.');
    }

     try {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = 'admin@example.com';`
          );
          
        if (users[0].length > 0) {
            const userId = users[0][0].id;
            await queryInterface.bulkInsert('posts', [{
                content: 'Hello World! This is the first post.',
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }], {});
        }
     } catch (e) {
     }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('posts', null, {});
  }
};
