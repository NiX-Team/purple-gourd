import { request } from '@/services/fetch'

export default new class Announcement {
  async getFollowingAnnouncements() {
    return await request('/announcements')
  }

  async getCreatedAnnouncements() {
    return await request('/users/announcements')
  }

  async getAnnouncementById(id) {
    return await request(`/announcements/${id}`)
  }

  async postAnnouncement(data) {
    return await request('/announcements', 'POST', data)
  }
}()
