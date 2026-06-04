import api from './api'

export const reviewService = {
  async createReview(data) {
    const res = await api.post('/reviews/', data)
    return res.data
  },
  async getReviews(params = {}) {
    const res = await api.get('/reviews/', { params })
    return res.data
  },
  async getReview(id) {
    const res = await api.get(`/reviews/${id}`)
    return res.data
  },
  async deleteReview(id) {
    await api.delete(`/reviews/${id}`)
  },
  async getDashboard() {
    const res = await api.get('/analytics/dashboard')
    return res.data
  },
}
