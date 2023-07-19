import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Channel } from 'stream-chat-react'; // Mock Channel component
import ChannelContainer from './ChannelContainer';

// mock components
jest.mock('./CreateChannel', () => () => <div data-testid="create-channel">CreateChannel Mock</div>);
jest.mock('./RegisterTable', () => () => <div data-testid="register-table">RegisterTable Mock</div>);
jest.mock('./RegisterForm', () => () => <div data-testid="register-form">RegisterForm Mock</div>);
jest.mock('./InnerChannel', () => () => <div data-testid="inner-channel">InnerChannel Mock</div>);

describe('ChannelContainer component', () => {
  test('renders CreateChannel when isCrt is true', () => {
    const { getByTestId, queryByTestId } = render(<ChannelContainer isCrt={true} />);
    expect(getByTestId('create-channel')).toBeInTheDocument();
    expect(queryByTestId('register-table')).not.toBeInTheDocument();
    expect(queryByTestId('register-form')).not.toBeInTheDocument();
    expect(queryByTestId('inner-channel')).not.toBeInTheDocument();
  });

  test('renders RegisterTable when isVis is true', () => {
    const { getByTestId, queryByTestId } = render(<ChannelContainer isVis={true} />);
    expect(getByTestId('register-table')).toBeInTheDocument();
    expect(queryByTestId('create-channel')).not.toBeInTheDocument();
    expect(queryByTestId('register-form')).not.toBeInTheDocument();
    expect(queryByTestId('inner-channel')).not.toBeInTheDocument();
  });

  test('renders RegisterForm when isRegis is true', () => {
    const { getByTestId, queryByTestId } = render(<ChannelContainer isRegis={true} />);
    expect(getByTestId('register-form')).toBeInTheDocument();
    expect(queryByTestId('create-channel')).not.toBeInTheDocument();
    expect(queryByTestId('register-table')).not.toBeInTheDocument();
    expect(queryByTestId('inner-channel')).not.toBeInTheDocument();
  });

  test('renders InnerChannel by default', () => {
    const { getByTestId, queryByTestId } = render(<ChannelContainer />);
    expect(getByTestId('inner-channel')).toBeInTheDocument();
    expect(queryByTestId('create-channel')).not.toBeInTheDocument();
    expect(queryByTestId('register-table')).not.toBeInTheDocument();
    expect(queryByTestId('register-form')).not.toBeInTheDocument();
  });

  test('should call setIsCrt when isCrt is true and CreateChannel is clicked', () => {
    const setIsCrtMock = jest.fn();
    const { getByTestId } = render(<ChannelContainer isCrt={true} setIsCrt={setIsCrtMock} />);
    fireEvent.click(getByTestId('create-channel'));
    expect(setIsCrtMock).toHaveBeenCalledWith(false);
  });
});





