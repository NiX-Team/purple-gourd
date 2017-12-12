import { request } from '@/services/fetch'

export default new class Announcement {
  async getFollowingAnnouncements() {
    return await request('/announcements')
  }
}()
