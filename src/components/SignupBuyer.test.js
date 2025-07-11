import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupBuyer from '../components/SignupBuyer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('SignupBuyer Component', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    global.fetch.mockReset();
    window.alert = jest.fn();
  });

  test('renders signup form inputs', () => {
    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create an account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/I accept the Terms and Conditions/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid username', () => {
    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'user123' }, // Contains numbers, should fail
    });

    expect(screen.getByText(/Username must contain only alphabets/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid email', () => {
    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Your email/i), {
      target: { value: 'invalidemail' },
    });

    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid password', () => {
    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'weak' },
    });

    expect(screen.getByText(/Password must have at least 8 characters/i)).toBeInTheDocument();
  });

  test('shows validation error for mismatched passwords', () => {
    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/^Password$/i, { selector: 'input[name="password"]' }), {
      target: { value: 'Test@123' },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm password$/i, { selector: 'input[name="confirmPassword"]' }), {
      target: { value: 'Mismatch123' },
    });

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue('Registration successful'),
    });

    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'TestUser' },
    });
    fireEvent.change(screen.getByLabelText(/Your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i, { selector: 'input[name="password"]' }), {
      target: { value: 'Test@123' },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm password$/i, { selector: 'input[name="confirmPassword"]' }), {
      target: { value: 'Test@123' },
    });
    fireEvent.change(screen.getByLabelText(/Pincode/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: 'Karnataka' },
    });

    // Check the terms checkbox
    fireEvent.click(screen.getByLabelText(/I accept the Terms and Conditions/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/SignupBuyer', expect.any(Object));
    });

    // Verify alert was shown
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Account created successfully!');
    });
  }, 10000);

  test('shows error on failed registration', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: jest.fn().mockResolvedValue('Registration failed'),
    });

    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'TestUser' },
    });
    fireEvent.change(screen.getByLabelText(/Your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i, { selector: 'input[name="password"]' }), {
      target: { value: 'Test@123' },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm password$/i, { selector: 'input[name="confirmPassword"]' }), {
      target: { value: 'Test@123' },
    });
    fireEvent.change(screen.getByLabelText(/Pincode/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/State/i), {
      target: { value: 'Karnataka' },
    });

    // Check the terms checkbox
    fireEvent.click(screen.getByLabelText(/I accept the Terms and Conditions/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Registration failed');
    });
  }, 10000);

  test('toggles to login form when login link is clicked', () => {
    render(<SignupBuyer onToggle={mockOnToggle} />, { wrapper: MemoryRouter });
    
    fireEvent.click(screen.getByText(/Login here/i));
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});