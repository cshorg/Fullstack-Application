import request from 'supertest'
import app from '../index'

describe('Check health route', () => {
  test('Health route', async () => {
    const res = await request(app).get('/')
    expect(res.body).toEqual({ status: 'healthy' })
  })
})
