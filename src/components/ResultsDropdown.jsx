import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const SResult = ({ channel, setChannel, queryId, type, toggleDropdownVisibility }) => {
  const { client, setActiveChannel } = useChatContext();

  const channelByUser = async () => {
    const filters = {
      type: 'messaging',
      member_count: 2,
      members: { $eq: [client.user.id, client.userID] },
    };

    const [existingChannel] = await client.queryChannels(filters);

    if (existingChannel) return setActiveChannel(existingChannel);

    const newChannel = client.channel('messaging', { members: [channel.id, client.userID] });

    setChannel(newChannel);

    return setActiveChannel(newChannel);
  };

  const handleClick = async () => {
    if (type === 'user') {
      await channelByUser();
    }

    if (toggleDropdownVisibility) {
      toggleDropdownVisibility((prevState) => !prevState);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={channel.id === queryId ? 'channel-search-resultCont-focused' : 'channel-search-resultCont'}
    >
      {type === 'channel' ? (
        <>
          <div className="result-sign">O</div>
          <p className="channel-search-result-text">{channel.data.name}</p>
        </>
      ) : (
        <div className="channel-search-result-user">
          <Avatar image={channel.image || undefined} name={channel.name} size={20} />
          <p className="channel-search-result-text">{channel.name}</p>
        </div>
      )}
    </div>
  );
};

const ResultsDropdown = ({ teamChannels, directChannels, setChannel, queryId, loading, toggleDropdownVisibility }) => {
  const { client } = useChatContext();

  // const channelByUser = async ({ channel, setActiveChannel }) => {
  //   const filters = {
  //     type: 'messaging',
  //     member_count: 2,
  //     members: { $eq: [client.user.id, client.userID] },
  //   };

  //   const [existingChannel] = await client.queryChannels(filters);

  //   if (existingChannel) return setActiveChannel(existingChannel);

  //   const newChannel = client.channel('messaging', { members: [channel.id, client.userID] });

  //   setChannel(newChannel);

  //   return setActiveChannel(newChannel);
  // };

  return (
    <div className="channel-search-results">
      <p className="channel-search-resultsHeader">Channels</p>
      {loading && !teamChannels.length && (
        <p className="channel-search-resultsHeader">
          <i>Channel ladet noch...</i>
        </p>
      )}
      {!loading && !teamChannels.length ? (
        <p className="channel-search-resultsHeader">
          <i>Keine Channels gefunden</i>
        </p>
      ) : (
        teamChannels?.map((channel, i) => (
          <SResult
            channel={channel}
            queryId={queryId}
            key={i}
            setChannel={setChannel}
            type="channel"
            toggleDropdownVisibility={toggleDropdownVisibility}
          />
        ))
      )}
      <p className="channel-search-resultsHeader">Benutzer</p>
      {loading && !directChannels.length && (
        <p className="channel-search-resultsHeader">
          <i>Channel ladet noch...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className="channel-search-resultsHeader">  
          <i>Keine private Nachrichten gefunden...</i>
        </p>
      ) : (
        directChannels?.map((channel, i) => (
          <SResult
            channel={channel}
            queryId={queryId}
            key={i}
            setChannel={setChannel}
            type="user"
            toggleDropdownVisibility={toggleDropdownVisibility}
          />
        ))
      )}
    </div>
  );
};
export default ResultsDropdown;
