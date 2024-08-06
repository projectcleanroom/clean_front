import partnerApiInstance from './partnerAxiosConfig';

export const getPartnerData = async () => {
  try {
    const response = await partnerApiInstance.get('/partner/data');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// other partner API calls...
