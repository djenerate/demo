import { FormData, ApiResponse } from '../types';

/*
  Mocked API call, replace with an API endpoint for real world applications
  Simulates random success/failure (90% success rate)
*/

export const submitContactForm = async (data: FormData): Promise<ApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          message: 'Thank you! Your message has been received.'
        });
      } else {
        reject(new Error('Network error. Please try again later.'));
      }
    }, 1500);
  });
};
