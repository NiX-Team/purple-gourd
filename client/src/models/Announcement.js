import { request } from '@/services/fetch'

class AnnouncementModel {
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

  async updateAnnouncement(id, data) {
    return await request(`/announcements/${id}`, 'PUT', data)
  }
}

const Announcement = new AnnouncementModel()

export default Announcement
