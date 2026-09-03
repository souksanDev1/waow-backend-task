const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_TEMP_EXPIRES_IN = '10m';
process.env.JWT_ACCESS_EXPIRES_IN = '7d';

const { app, sequelize } = require('../src/app');
const { User, OtpVerification } = require('../src/models');

const PHONE = '8562056666666';

async function requestOtp(phone = PHONE) {
  return request(app).post('/api/users/otp').send({ phone_number: phone });
}

async function registerWithOtp(name = 'John Doe') {
  const otpRes = await requestOtp();
  const tempToken = otpRes.headers['x-temp-token'];
  const otpCode = otpRes.body.data.otp_code;

  return request(app)
    .post('/api/users/register')
    .set('Authorization', `Bearer ${tempToken}`)
    .send({ otp_code: otpCode, name });
}

describe('Users API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await OtpVerification.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('response format and validation', () => {
    it('rejects unknown fields with VALIDATION_ERR_UNKNOWN_FIELD', async () => {
      const res = await request(app).post('/api/users/otp').send({
        phone_number: PHONE,
        other_field_not_in_validation: 'sometimes',
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body).toMatchObject({
        error: true,
        code: 'VALIDATION_ERR_UNKNOWN_FIELD',
        message: 'Bad Request',
        data: {},
      });
    });

    it('returns success envelope on OTP request', async () => {
      const res = await requestOtp();

      expect(res.status).toBe(200);
      expect(res.body.error).toBe(false);
      expect(res.body.code).toBe(0);
      expect(res.body.message).toBe('Success');
      expect(res.body.data).toHaveProperty('otp_code');
      expect(res.headers['x-temp-token']).toBeTruthy();
    });
  });

  describe('OTP rules', () => {
    it('blocks the 4th OTP request within 1 hour', async () => {
      await requestOtp();
      await requestOtp();
      await requestOtp();
      const res = await requestOtp();

      expect(res.body).toMatchObject({
        error: true,
        code: 'OTP_ERR_MAX_REQUEST',
        data: {},
      });
      expect(res.body.message).toMatch(/Max OTP request exceeded/i);
    });

    it('blocks the 4th wrong OTP attempt', async () => {
      const otpRes = await requestOtp();
      const tempToken = otpRes.headers['x-temp-token'];

      for (let i = 0; i < 3; i += 1) {
        const wrong = await request(app)
          .post('/api/users/login')
          .set('Authorization', `Bearer ${tempToken}`)
          .send({ otp_code: '000000' });
        expect(wrong.body.code).not.toBe('OTP_ERR_MAX_ATTEMPT');
      }

      const fourth = await request(app)
        .post('/api/users/login')
        .set('Authorization', `Bearer ${tempToken}`)
        .send({ otp_code: '000000' });

      expect(fourth.body).toMatchObject({
        error: true,
        code: 'OTP_ERR_MAX_ATTEMPT',
        data: {},
      });
      expect(fourth.body.message).toMatch(/Wrong OTP attempted exceeded/i);
    });
  });

  describe('register, login, profile', () => {
    it('registers a user after OTP verification and returns an access token', async () => {
      const res = await registerWithOtp();

      expect(res.status).toBe(200);
      expect(res.body.error).toBe(false);
      expect(res.body.data.access_token).toBeTruthy();
      expect(await User.count()).toBe(1);
    });

    it('logs in with a valid OTP and returns an access token', async () => {
      await registerWithOtp();
      await OtpVerification.destroy({ where: {}, truncate: true });

      const otpRes = await requestOtp();
      const res = await request(app)
        .post('/api/users/login')
        .set('Authorization', `Bearer ${otpRes.headers['x-temp-token']}`)
        .send({ otp_code: otpRes.body.data.otp_code });

      expect(res.status).toBe(200);
      expect(res.body.data.access_token).toBeTruthy();
    });

    it('returns the authenticated profile', async () => {
      const registerRes = await registerWithOtp('Jane Doe');
      const token = registerRes.body.data.access_token;

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        phone_number: PHONE,
        name: 'Jane Doe',
      });
    });

    it('updates profile fields but not phone_number', async () => {
      const registerRes = await registerWithOtp();
      const token = registerRes.body.data.access_token;

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name', phone_number: '8562099999999' });

      expect(res.status).toBeGreaterThanOrEqual(400);

      const ok = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });

      expect(ok.status).toBe(200);
      expect(ok.body.data.name).toBe('Updated Name');
      expect(ok.body.data.phone_number).toBe(PHONE);
    });
  });
});
