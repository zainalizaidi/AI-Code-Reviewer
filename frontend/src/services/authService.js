import api from './api'

export const authService = {
  async signup(data) {
    const res = await api.post('/auth/signup', data)
    return res.data
  },
  async login(data) {
    const res = await api.post('/auth/login', data)
    return res.data
  },
  async getMe() {
    const res = await api.get('/auth/me')
    return res.data
  },
  async updateAccount(data) {
    const res = await api.put('/auth/update', data)
    return res.data
  },
  async deleteAccount() {
    await api.delete('/auth/delete')
  },
}
