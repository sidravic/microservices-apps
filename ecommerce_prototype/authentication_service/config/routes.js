var usersController = require('./../controllers/users_controller.js');

module.exports = [
    { path: '/api/v1/users', method: 'POST', config: usersController.create},
    { path: '/api/v1/user/{id}', method: 'GET', config: usersController.get},
    { path: '/api/v1/users/auth', method: 'POST', config: usersController.auth}
]
