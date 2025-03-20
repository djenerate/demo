import { submitContactForm } from './contactApi';

jest.useFakeTimers();

describe('Contact API', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  test('Simulate successful API call - should resolve with success response', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    
    const promise = submitContactForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    });

    jest.advanceTimersByTime(2000);
    
    const result = await promise;

    expect(result).toEqual({
      success: true,
      message: 'Thank you! Your message has been received.'
    });
  });

  test('Simulate network error - should reject with error', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.05);

    const apiPromise = submitContactForm({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message'
    });
    
    jest.advanceTimersByTime(2000);
    
    await expect(apiPromise).rejects.toThrow('Network error. Please try again later.');
  });
});
