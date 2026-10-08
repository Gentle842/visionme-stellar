import request from 'supertest';
import express from 'express';
import sbtRouter from './sbt';

describe('GET /api/sbt/status/:userId', () => {
  const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      (req as any).userId = 'owner-id';
      next();
    });
    app.use('/api/sbt', sbtRouter);
    return app;
  };

  it('returns 403 when the param does not match the JWT subject', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/sbt/status/other-id');
    expect(res.status).toBe(403);
  });

  it('returns 403 when the param is a different user id', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/sbt/status/owner-id');
    expect(res.status).toBe(404);
  });
});
