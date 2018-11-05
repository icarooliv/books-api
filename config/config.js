export default {
  username: 'postgres',
  password: 'puma',
  database: `${process.env.NODE_ENV}_books`,
  params: {
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'oyvPHHyf05',
  jwtSession: { session: false },
};
