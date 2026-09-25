import request from 'supertest';

describe('e2e tests', () => {
  it('/weather (GET)', () => {
    return request('http://127.0.0.1:3000')
      .get('/weather')
      .query({ city: 'Paris' })
      .expect(200)
      .expect('orage 🌩️');
  });
});
