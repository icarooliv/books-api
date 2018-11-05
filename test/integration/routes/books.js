import jwt from 'jwt-simple';

describe('Routes Books', () => {
  const { Books } = app.datasource.models;
  const { Users } = app.datasource.models;
  const { jwtSecret } = app.config;

  const defaultBook = {
    id: 1,
    name: 'default book',
    description: 'default description',
  };

  let token;

  after(() => {
    Users
      .destroy({ where: {} });
  });

  beforeEach((done) => {
    Users.destroy({ where: {} })
      .then(() => Users.create({
        name: 'Jon Doe',
        email: 'jondoe@mail.com',
        password: '123123',
      }))
      .then((user) => {
        Books.destroy({ where: {} })
          .then(() => Books.create(defaultBook))
          .then(() => {
            token = jwt.encode({ id: user.id }, jwtSecret);
            done();
          });
      });
  });

  describe('Route GET /books', () => {
    it('should return a list of books', (done) => {
      request
        .get('/books')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          // resposta esperada
          expect(res.body[0].id).to.be.eql(defaultBook.id);
          expect(res.body[0].name).to.be.eql(defaultBook.name);
          expect(res.body[0].description).to.be.eql(defaultBook.description);
          // msg de erro
          done(err);
        });
    });
  });
  describe('Route GET /books/{id}', () => {
    it('should return a book', (done) => {
      request
        .get('/books/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          // resposta esperada
          expect(res.body.id).to.be.eql(defaultBook.id);
          expect(res.body.name).to.be.eql(defaultBook.name);
          expect(res.body.description).to.be.eql(defaultBook.description);
          // msg de erro
          done(err);
        });
    });
  });
  describe('Route POST /books', () => {
    it('should return a book', (done) => {
      const newBook = {
        id: 2,
        name: 'new book',
        description: 'newDescription',
      };

      request
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(newBook)
        .end((err, res) => {
          // resposta esperada
          expect(res.body.id).to.be.eql(newBook.id);
          expect(res.body.name).to.be.eql(newBook.name);
          expect(res.body.description).to.be.eql(newBook.description);
          // msg de erro
          done(err);
        });
    });
  });
  describe('Route PUT /books/{id}', () => {
    it('should update a book', (done) => {
      const updatedBook = {
        id: 1,
        name: 'updated book',
      };

      request
        .put('/books/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBook)
        .end((err, res) => {
          // resposta esperada
          expect(res.body).to.be.eql([1]);
          // msg de erro
          done(err);
        });
    });
  });
  describe('Route DELETE /books/{id}', () => {
    it('should delete a book', (done) => {
      request
        .delete('/books/1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          // resposta esperada
          expect(res.statusCode).to.be.eql(204);
          // msg de erro
          done(err);
        });
    });
  });
});
