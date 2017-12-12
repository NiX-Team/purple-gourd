import { request } from '@/services/fetch'

export default new class Announcement {
  async getFollowingAnnouncements() {
    return await request('/announcements')
  }

  async getAnnouncementById(id) {
    return await request(`/announcements/${id}`)
  }
}()
