import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.set('password', bcrypt.hashSync(user.password, salt));
      },
      beforeUpdate: (user) => {
        if (user.password) {
          const salt = bcrypt.genSaltSync();
          user.set('password', bcrypt.hashSync(user.password, salt));
        }
      },
      beforeBulkUpdate: (user) => {
        if (user.password) {
          const salt = bcrypt.genSaltSync();
          user.set('password', bcrypt.hashSync(user.password, salt));
        }
      },
    },
  });
  Users.isPassword = (encodedPassword, password) => bcrypt.compareSync(password, encodedPassword);

  return Users;
};
