import HttpStatus from 'http-status';
import jwt from 'jwt-simple';

describe('Routes: Users', () => {
  const { Users } = app.datasource.models;
  const { jwtSecret } = app.config;
  const { sequelize } = app.datasource;

  const defaultUser = {
    id: 2,
    name: 'John',
    email: 'john2@gmail.com',
    password: 'testPassword',
  };

  let token;

  after(() => {
    Users
      .destroy({ where: {} });
  });

  beforeEach((done) => {
    Users
      .destroy({ where: {} })
      .then(() => {
        sequelize.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 1;');
        Users.create({
          id: 1,
          name: 'John',
          email: 'john1@gmail.com',
          password: '12345',
        });
      })
      .then(() => {
        Users.create(defaultUser)
          .then(() => {
            console.log('-----------------------', defaultUser.id);
            token = jwt.encode({ id: defaultUser.id }, jwtSecret);
            done();
          });
      });
  });

  describe('GET /users', () => {
    it('should return a list of users', (done) => {
      request
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body[1].name).to.eql(defaultUser.name);
          expect(res.body[1].id).to.eql(defaultUser.id);
          done(err);
        });
    });
  });

  describe('GET /users/{id}', () => {
    it('should return a user by id', (done) => {
      request
        .get('/users/2')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body.name).to.eql(defaultUser.name);
          expect(res.body.id).to.eql(defaultUser.id);
          done(err);
        });
    });
  });

  describe('POST /register', () => {
    it('should post a user', (done) => {
      const user = {
        id: 3,
        name: 'User Created',
        email: 'newUser@mail.com',
        password: 'newUserPwd',
      };

      request
        .post('/register')
        .send(user)
        .end((err, res) => {
          expect(res.body.name).to.eql(user.name);
          expect(res.body.id).to.eql(user.id);
          done(err);
        });
    });
  });

  describe('PUT /users/{id}', () => {
    it('should update a user', (done) => {
      const user = {
        id: 1,
        name: 'User Updated',
      };

      request
        .put('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          expect(res.body).to.eql(1);
          done(err);
        });
    });
  });

  describe('DELETE /users/{id}', () => {
    it('should delete a user', (done) => {
      request
        .delete('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.eql(HttpStatus.NO_CONTENT);
          done(err);
        });
    });
  });
});
