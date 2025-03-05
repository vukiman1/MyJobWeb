import httpRequest from '../utils/httpRequest';

const goongService = {
  getPlaces: (input) => {
    const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=gof5Ti3n8DCEDD5bHl3uVXPbHDJg3BlcL5rDXyvV&input=${input}&limit=15`;

    return httpRequest.get(url);
  },
  getPlaceDetailByPlaceId: (id) => {
    const url = `https://rsapi.goong.io/Place/Detail?place_id=${id}&api_key=gof5Ti3n8DCEDD5bHl3uVXPbHDJg3BlcL5rDXyvV&input`;

    return httpRequest.get(url);
  },
};

export default goongService;
