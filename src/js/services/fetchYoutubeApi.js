//const API_KEY = "AIzaSyCDTsNUCO7DDPLZVEmNL80_3dxDzTZox0k";
//const API_KEY = "AIzaSyAo9zyi5a8Uiy_WJRes0DvFJru5QbGdSfM";
const API_KEY = "AIzaSyCDTsNUCO7DDPLZVEmNL80_3dxDzTZox0k";
const API_BASE_URL = "https://youtube.googleapis.com/youtube/v3/search?";
export class fetchYoutubeApi {
  async getTrailer(title) {
    try {
      const response = await fetch(
        `${API_BASE_URL}part=snippet&q=${title}&maxResults=3&key=${API_KEY}`
      );
      if (!response.ok) {
        const respJson = await response.json();
        throw new Error(respJson.status_message);
      }
      const data = await response.json();
      const items = data.items;

      return items;
    } catch (error) {
      console.log(error);
    }
  }
}
