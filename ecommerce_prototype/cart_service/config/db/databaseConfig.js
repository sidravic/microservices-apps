var config = {
  development: {
      host: 'localhost',
      port: 27017,
      database: 'carts_development'
  },

  staging:{
      host: 'localhost',
      port: 27017,
      database: 'carts_staging'
  },

  production: {
      host: 'localhost',
      port: 27017,
      database: 'carts_production'
  }

}

module.exports = config;