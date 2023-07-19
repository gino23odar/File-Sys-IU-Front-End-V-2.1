import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeamChannelPreview from './TeamChannelPreview';

// Mocking useChatContext
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(() => ({
    channel: { id: 'dummy-channel-id' },
    client: { userID: 'dummy-user-id' },
  })),
  Avatar: () => <div>Dummy Avatar</div>,
}));

describe('TeamChannelPreview component', () => {
  test('renders channel name for type="team"', () => {
    render(<TeamChannelPreview channel={{ data: { name: 'Channel Name' } }} type="team" />);
    expect(screen.getByText('#Channel Name')).toBeInTheDocument();
  });

  test('renders channel id for type="team" if name is not available', () => {
    render(<TeamChannelPreview channel={{ data: { id: 'channel-id' } }} type="team" />);
    expect(screen.getByText('#channel-id')).toBeInTheDocument();
  });

  test('renders DirectPreview for type="messaging"', () => {
    render(<TeamChannelPreview channel={{ state: { members: { 1: { user: { id: 'user1-id', fullName: 'User 1' } } } } }} type="messaging" />);
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('Mocked Avatar')).toBeInTheDocument();
  });

  test('sets active channel and calls setToggleContainer when clicked', () => {
    const setActiveChannel = jest.fn();
    const setToggleContainer = jest.fn();

    render(
      <TeamChannelPreview
        channel={{ data: { name: 'Channel Name' } }}
        type="team"
        setActiveChannel={setActiveChannel}
        setToggleContainer={setToggleContainer}
      />
    );

    fireEvent.click(screen.getByText('#Channel Name'));

    expect(setActiveChannel).toHaveBeenCalledWith({ data: { name: 'Channel Name' } });
    expect(setToggleContainer).toHaveBeenCalled();
  });
});
