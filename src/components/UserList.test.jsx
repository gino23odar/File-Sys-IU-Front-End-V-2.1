import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserList from './UserList';

// Mocking useChatContext
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(() => ({
    client: { userID: 'user-id' }, 
    queryUsers: jest.fn(async () => ({ users: [{ id: 'user1', name: 'User 1' }, { id: 'user2', name: 'User 2' }] })),
  })),
  Avatar: () => <div>Dummy Avatar</div>,
}));

describe('UserList component', () => {
  test('renders loading message while loading', () => {
    render(<UserList setSelectedUsers={jest.fn()} />);
    expect(screen.getByText('Benutzer werden geladen...')).toBeInTheDocument();
  });

  test('renders error message when there is an error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<UserList setSelectedUsers={jest.fn()} />);
    expect(screen.getByText('Fehler beitritt.')).toBeInTheDocument();
  });

  test('renders "Keine Benutzer." message when users list is empty', () => {
    render(<UserList setSelectedUsers={jest.fn()} />);
    expect(screen.getByText('Keine Benutzer.')).toBeInTheDocument();
  });

  test('renders user list with selectable items', () => {
    const setSelectedUsers = jest.fn();
    render(<UserList setSelectedUsers={setSelectedUsers} />);
    const userItems = screen.getAllByRole('button');

    expect(userItems.length).toBe(2); // two returns from mocked queryUsers

    fireEvent.click(userItems[0]);

    expect(setSelectedUsers).toHaveBeenCalledWith(['user1']); // correct ids?>

    fireEvent.click(userItems[1]);

    expect(setSelectedUsers).toHaveBeenCalledWith(['user1', 'user2']); // correct ids?
  });
});
