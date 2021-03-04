import React from 'react';
import moment from 'moment';
import {Comment , Image} from 'semantic-ui-react'

const timeFromNow = timestamp => moment(timestamp).fromNow()

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const Message = ({message}) => (
    <Comment>
        <Comment.Avatar src={message.user.avatar}></Comment.Avatar>
        <Comment.Content className="message__self">
            <Comment.Author as="a">{message.user.name}</Comment.Author>
            <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
            {
                isImage(message) ? 
                <Image src={message.image} className="message_image"/> :
                <Comment.Text>{message.content}</Comment.Text>
            }
        </Comment.Content>
    </Comment>
)

export default Message;