import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserSettings from './UserSettings';

// Mocking useChatContext hook
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(() => ({
    client: { userID: 'dummy-user-id' },
    partialUpdateUser: jest.fn(),
  })),
}));

describe('UserSettings component', () => {
  test('renders logout icon', () => {
    render(<UserSettings logout={jest.fn()} />);
    expect(screen.getByAltText('Logout')).toBeInTheDocument();
  });

  test('renders avatar change option and opens AvatarChange component on click', () => {
    render(<UserSettings logout={jest.fn()} />);
    const avatarChangeOption = screen.getByText('Avatar ändern');

    expect(avatarChangeOption).toBeInTheDocument();

    fireEvent.click(avatarChangeOption);

    const newAvatarUrlInput = screen.getByPlaceholderText('Neue Avatar URL');
    expect(newAvatarUrlInput).toBeInTheDocument();
  });

  test('calls logout function when the logout icon is clicked', () => {
    const logoutMock = jest.fn();
    render(<UserSettings logout={logoutMock} />);
    const logoutIcon = screen.getByAltText('Logout');

    fireEvent.click(logoutIcon);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  test('calls partialUpdateUser function with newAvatarURL when the "ändern" button is clicked', () => {
    const partialUpdateUserMock = jest.fn();
    const client = {
      userID: 'user-id',
      partialUpdateUser: partialUpdateUserMock,
    };

    render(<UserSettings logout={jest.fn()} />);

    const avatarChangeOption = screen.getByText('Avatar ändern');
    fireEvent.click(avatarChangeOption);

    const newAvatarUrlInput = screen.getByPlaceholderText('Neue Avatar URL');
    fireEvent.change(newAvatarUrlInput, { target: { value: 'https://example.com/avatar.jpg' } });

    const changeButton = screen.getByText('ändern');
    fireEvent.click(changeButton);

    expect(partialUpdateUserMock).toHaveBeenCalledWith({
      id: 'user-id',
      set: {
        image: 'https://example.com/avatar.jpg',
      },
    });
  });
});
