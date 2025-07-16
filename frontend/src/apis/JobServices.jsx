import axiosConfig from "../axiosConfig";
import { sampleJobsData } from "../constants/sampleData";

export const getAllJobs = (page) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "get",
        url: `/job/get-all?page=${page}`,
      });
      resolve(response.data);
    } catch (error) {
      console.warn("API không khả dụng. Sử dụng sample data.");
      return sampleJobsData;
      // reject(error);
    }
  });

  export const getJobById = (jobId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: 'get',
        url: `job/get-by-id/${jobId}`,
        // headers: {
        //   Authorization: `Bearer ${token}`
        // }
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });