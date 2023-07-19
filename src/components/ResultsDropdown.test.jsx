import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useChatContext } from 'stream-chat-react'; // Mock useChatContext
import ResultsDropdown, { SResult } from './ResultsDropdown';

// Mock useChatContext
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
}));

describe('ResultsDropdown component', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    useChatContext.mockReturnValue({
      client: { userID: 'mockUserID' },
    });
  });

  test('renders ResultsDropdown with channel and user results', () => {
    const teamChannels = [
      { id: 'channel1', data: { name: 'Channel 1' } },
      { id: 'channel2', data: { name: 'Channel 2' } },
    ];

    const directChannels = [
      { id: 'user1', name: 'User 1', image: 'user1.jpg' },
      { id: 'user2', name: 'User 2', image: 'user2.jpg' },
    ];

    const { getByText, getAllByText } = render(
      <ResultsDropdown
        teamChannels={teamChannels}
        directChannels={directChannels}
        setChannel={jest.fn()}
        queryId="channel1"
        loading={false}
        toggleDropdownVisibility={jest.fn()}
      />
    );

    expect(getByText('Channels')).toBeInTheDocument();
    expect(getByText('Benutzer')).toBeInTheDocument();

    expect(getByText('Channel 1')).toBeInTheDocument();
    expect(getByText('Channel 2')).toBeInTheDocument();

    expect(getByText('User 1')).toBeInTheDocument();
    expect(getByText('User 2')).toBeInTheDocument();

    // Avatar rendered?
    const avatars = getAllByText(/User/);
    expect(avatars).toHaveLength(2);
  });

  test('calls setChannel and toggleDropdownVisibility on SResult click', () => {
    const setChannel = jest.fn();
    const toggleDropdownVisibility = jest.fn();

    const channel = { id: 'channel1', data: { name: 'Channel 1' } };
    const { getByText } = render(
      <SResult
        channel={channel}
        queryId="channel1"
        setChannel={setChannel}
        type="channel"
        toggleDropdownVisibility={toggleDropdownVisibility}
      />
    );

    const channelResult = getByText('Channel 1');
    fireEvent.click(channelResult);

    expect(setChannel).toHaveBeenCalledWith(channel);

    // Expect toggleDropdownVisibility to have been triggered once
    expect(toggleDropdownVisibility).toHaveBeenCalledTimes(1);
  });
});
