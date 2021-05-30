import React, { useState, useEffect } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

function MessagesForm(props) {
    const [messagesForm, setMessagesForm] = useState({
        storageRef: firebase.storage().ref(),
        uploadState: '',
        uploadTask: null,
        percentUploaded: 0,
        messages: '',
        channel: props.currentChannel,
        user: props.currentUser,
        getMessagesRef:props.getMessagesRef,
        loading: false,
        errors: []
    })

    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setMessagesForm({
            ...messagesForm,
            [name]: value
        })
    }
    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: messagesForm.user.uid,
                name: messagesForm.user.displayName,
                avatar: messagesForm.user.photoURL
            },
            content: messagesForm.messages
        }
        if (fileUrl !== null) {
            message['image'] = fileUrl;
        } else {
            message['content'] = messagesForm.messages;
        }
        return message;
    }
    const sendMessage = (e) => {
        e.preventDefault();
        const channel = props.currentChannel
        const message = messagesForm.messages
        if (message) {
            messagesForm.getMessagesRef()
                .child(channel.id)
                .push()
                .set(createMessage())
                .then(() => {
                    setMessagesForm({
                        ...messagesForm,
                        loading: false,
                        messages: ''
                    })
                })
                .catch(err => {
                    console.log(err)
                    setMessagesForm({
                        ...messagesForm,
                        loading: false
                    })
                })
        } else {
            console.log(2)
        }
    }
    useEffect(() => {
        document.querySelector('.ui.comments.messages').scrollTop = document.querySelector('.ui.comments.messages').scrollHeight
    }, [messagesForm]);
    return (
        <Segment className="messages__form">
            <form onSubmit={sendMessage}>
            <Input
                fluid
                name="messages"
                style={{ marginBottom: '0.7em' }}
                label={<Button icon={'add'} />}
                labelPosition="left"
                placeholder="Write your message"
                value={messagesForm.messages}
                onChange={handleInputChange}
            />
            <Button.Group icon widths="2">
                <Button
                    type="submit"
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                    disabled={messagesForm.loading}
                />
            </Button.Group>
            </form>
        </Segment>
    )
}

export default MessagesForm;