import React, { useState , useEffect } from 'react';
import {Segment,Comment} from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';
import firebase from '../../firebase';

function Messages(props) {
  const channel = props.currentChannel;
  const user = props.currentUser;
  const isPrivateChannel = props.isPrivateChannel;
  const [numUniqueUsers,setNumUniqueUsers] = useState('');
  const [searchTerm,setsearchTerm] = useState('');
  const [searchResult,setSearchResult] = useState([]);
  const [privateMessagesRef] = useState(firebase.database().ref('privateMessages'))
  const [messages,setMessages] = useState({
    messagesRef:firebase.database().ref('messages'),
    messagesList:[],
    messagesLoading:true,
  })
  const getListeners = () => {
    if(user && channel){
      getMessageListeners(channel.id)
    }
  }
  const getMessageListeners = channelId => {
    let loadedMessages = [];
    const ref = getMessagesRef()
    ref.child(channelId).on('child_added',item=>{
      loadedMessages.push(item.val())
      setMessages({
        ...messages,
        messagesList:loadedMessages,
        messagesLoading:false
      })
    })
    countUniqueUsers(loadedMessages)
  }

  const countUniqueUsers = messages => {
    const uniqurUsers = messages.reduce((acc,message)=>{
      if(!acc.includes(message.user.name)){
        acc.push(message.user.name)
      }
      return acc;
    },[]);
    const plural = uniqurUsers.length > 1 || uniqurUsers.length === 0;
    const numUniqueUserss = `${uniqurUsers.length} user${plural ? "s" : ""}`;
    setNumUniqueUsers(numUniqueUserss)
  }

  const displayChannelName = channel =>  {
    return channel ? `${isPrivateChannel ? '@' : '#'} ${channel.name}`:'';
  }

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messages.messagesRef
  }

  const handleSearchChange = event => {
    setsearchTerm(event.target.value)
    handleSearchMessage();
  }

  const handleSearchMessage = () => {
    const channelMessages = messages.messagesList;
    const regex = new RegExp(searchTerm,'gi');
    const newSearchResults = channelMessages.reduce((acc,message)=>{
      if( (message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    },[])
    setSearchResult(newSearchResults)
  }
  useEffect(getListeners, [])
  return (
    <div>
    <MessagesHeader
      numUniqueUsers={numUniqueUsers}
      handleSearchChange={handleSearchChange}
      channelName={displayChannelName(channel)}
      isPrivateChannel={isPrivateChannel}
    />
    <Segment>
      <Comment.Group className="messages">
        
        {
          searchTerm 
          ? 
          searchResult.map(message=>(
              <Message
                key={message.timestamp}
                message={message}
              />
            ))
          : 
          messages.messagesList.map(message=>(
            <Message
              key={message.timestamp}
              message={message}
            />
          ))
        }
      </Comment.Group>
    </Segment>
    <MessagesForm
      messagesRef={messages.messagesRef}
      currentChannel={channel}
      currentUser={user}
      isPrivateChannel={isPrivateChannel}
      getMessagesRef={getMessagesRef}
    />
    </div>

  );
}

export default Messages;
