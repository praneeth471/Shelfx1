import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginSeller from '../components/LoginSeller';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

const renderLoginSeller = (props = {}) => {
  return render(
    <BrowserRouter>
      <LoginSeller {...props} />
    </BrowserRouter>
  );
};

describe('LoginSeller Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  it('renders login form correctly', () => {
    renderLoginSeller();
    
    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(screen.getByLabelText('Your email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderLoginSeller();
    
    const emailInput = screen.getByLabelText('Your email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
  });

  it('allows valid email input', () => {
    renderLoginSeller();
    
    const emailInput = screen.getByLabelText('Your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
  });

  it('handles successful login', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    renderLoginSeller();
    
    const emailInput = screen.getByLabelText('Your email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/seller-xyz');
    });
  });

  it('handles login failure', async () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    renderLoginSeller();
    
    const emailInput = screen.getByLabelText('Your email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Invalid username or password');
    });

    mockAlert.mockRestore();
  });

  it('handles network error', async () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    renderLoginSeller();
    
    const emailInput = screen.getByLabelText('Your email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('An error occurred. Please try again.');
    });

    mockAlert.mockRestore();
    mockConsoleError.mockRestore();
  });

  it('calls onToggle when signup link is clicked', () => {
    const mockOnToggle = jest.fn();
    renderLoginSeller({ onToggle: mockOnToggle });
    
    const signupLink = screen.getByText('Sign up here');
    fireEvent.click(signupLink);
    
    expect(mockOnToggle).toHaveBeenCalled();
  });
});