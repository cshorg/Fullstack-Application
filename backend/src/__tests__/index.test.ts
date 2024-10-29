import request from 'supertest'
import { app } from '../index'

describe('GET /', () => {
  it('should return status healthy', async () => {
    const res = await request(app).get('/')
    expect(res.body).toEqual({ status: 'healthy' })
  })
})
