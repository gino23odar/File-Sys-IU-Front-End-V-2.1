import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useChatContext, useChannelStateContext, useChannelActionContext } from 'stream-chat-react'; // Mockimports
import InnerChannel from './InnerChannel';

// Mock useChatContext, useChannelStateContext, and useChannelActionContext hooks
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
  useChannelStateContext: jest.fn(),
  useChannelActionContext: jest.fn(),
  Avatar: () => <div data-testid="avatar">Avatar Mock</div>, // Mock Avatar component
}));

// Mock ChannelInfo
jest.mock('../assets/ChannelInfo.js', () => () => <div data-testid="channel-info">ChannelInfo Mock</div>);

describe('InnerChannel component', () => {
  const sendMessageMock = jest.fn();
  const setIsRegisMock = jest.fn();
  const setGiphyStateMock = jest.fn();
  const giphyState = false;

  beforeEach(() => {
    // Reset mock implementations and mock hook data before each test
    useChatContext.mockReturnValue({
      client: { userID: 'mockUserID' },
    });
    useChannelActionContext.mockReturnValue({
      sendMessage: sendMessageMock,
    });
    useChannelStateContext.mockReturnValue({
      channel: {
        type: 'messaging',
        data: { name: 'Mock Channel', cid: 'channel-id' },
        state: {
          members: {
            mockMember1: { user: { id: 'mockMember1', fullName: 'Mock User 1' } },
            mockMember2: { user: { id: 'mockMember2', fullName: 'Mock User 2' } },
          },
        },
      },
    });
  });

  test('renders HeaderMsg for messaging channel', () => {
    const { getByTestId, queryByText } = render(<InnerChannel setIsRegis={setIsRegisMock} />);
    const headerMsg = getByTestId('header-msg');
    const teamChannelHeaderName = queryByText('# Mock Channel');
    const channelInfo = queryByText('ChannelInfo Mock');

    expect(headerMsg).toBeInTheDocument();
    expect(teamChannelHeaderName).not.toBeInTheDocument();
    expect(channelInfo).not.toBeInTheDocument();
    expect(queryByText('2 Benutzer:')).toBeInTheDocument();
    expect(queryByText('Mock User 1')).toBeInTheDocument();
    expect(queryByText('Mock User 2')).toBeInTheDocument();
  });

  test('renders HeaderMsg for non-messaging channel', () => {
    useChannelStateContext.mockReturnValueOnce({
      channel: {
        type: 'team',
        data: { name: 'Mock Team Channel', cid: 'channel-id' },
      },
    });
    const { getByTestId, queryByText } = render(<InnerChannel setIsRegis={setIsRegisMock} />);
    const headerMsg = getByTestId('header-msg');
    const teamChannelHeaderName = queryByText('# Mock Team Channel');
    const channelInfo = queryByText('ChannelInfo Mock');

    expect(headerMsg).toBeInTheDocument();
    expect(teamChannelHeaderName).toBeInTheDocument();
    expect(channelInfo).toBeInTheDocument();
    expect(queryByText('2 Benutzer:')).not.toBeInTheDocument();
    expect(queryByText('Mock User 1')).not.toBeInTheDocument();
    expect(queryByText('Mock User 2')).not.toBeInTheDocument();
  });
});
