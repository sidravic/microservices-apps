var config = {
  development: {
      host: 'localhost',
      port: 27017,
      database: 'users_development'
  },

  staging:{
      host: 'localhost',
      port: 27017,
      database: 'users_staging'
  },

  production: {
      host: 'localhost',
      port: 27017,
      database: 'users_production'
  }

}

module.exports = config;