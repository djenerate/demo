import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import { submitContactForm } from '../api/contactApi';

jest.mock('../api/contactApi', () => ({
  submitContactForm: jest.fn()
}));

const mockedSubmitContactForm = submitContactForm as jest.Mock;

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('ContactForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the contact form with all fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('displays validation errors when form is submitted with empty fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await flushPromises();
    });
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'invalidemail@invalid');
      await user.type(screen.getByLabelText(/message/i), 'Test message with at least 10 chars');
      await flushPromises();
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await flushPromises();
    });
    
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test('validates message length', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Too short');
      await flushPromises();
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await flushPromises();
    });
    
    expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
  });

  test('shows loading state during form submission', async () => {
    const user = userEvent.setup();
    mockedSubmitContactForm.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        success: true,
        message: 'Thank you! Your message has been received.'
      }), 100))
    );
    
    render(<ContactForm />);
    
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message with at least 10 chars');
      await flushPromises();
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await flushPromises();
    });
    
    expect(screen.getByRole('button', { name: /sending\.\.\./i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('displays success message when form submission succeeds', async () => {
    const user = userEvent.setup();
    mockedSubmitContactForm.mockResolvedValue({
      success: true,
      message: 'Thank you! Your message has been received.'
    });
    
    render(<ContactForm />);
    
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message with at least 10 chars');
      await flushPromises();
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await flushPromises();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been received\./i)).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
    
    expect(mockedSubmitContactForm).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message with at least 10 chars'
    });
  });

  test('displays error message when form submission fails', async () => {
    const user = userEvent.setup();
    mockedSubmitContactForm.mockRejectedValue(new Error('Network error. Please try again later.'));
    
    render(<ContactForm />);
    
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'Test User');
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message with at least 10 chars');
      await flushPromises();
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await flushPromises();
    });
    
    await waitFor(() => {
      expect(screen.getByText(/network error\. please try again later\./i)).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Test message with at least 10 chars');
  });

  test('clears validation errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await flushPromises();
    });
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'T');
      await flushPromises();
    });
    
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });
});
