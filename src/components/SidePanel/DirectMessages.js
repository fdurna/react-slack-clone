import React, { useState, useEffect } from 'react'
import firebase from '../../firebase';
import {connect} from 'react-redux';
import {setCurrentChannel,setPrivateChannel} from '../../_actions';
import { Menu, Icon } from 'semantic-ui-react';

function DirectMessages(props) {
    const user = props.currentUser.currentUser;
    const [activeChannel, setActiveChannel] = useState('');
    const [directMessages, setDirectMessages] = useState({
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef:firebase.database().ref('presence')
    })
    const addListeners = currentUserUid =>  {
        let loadedUser = [];
        directMessages.usersRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUser.push(user);
                setDirectMessages({
                    ...directMessages,
                    users: loadedUser
                })
                console.log(directMessages.users)
            }
        })
        directMessages.connectedRef.on('value',snap => {
            if(snap.val() === true){
                const ref = directMessages.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove(err=> {
                    if(err !== null){
                        console.log(err)
                    }
                })
            }
        })
        directMessages.presenceRef.on('child_moved', snap => {
            if(currentUserUid !== snap.key){
                addStatusToUser(snap.key, false);
            }
        })
    }
    
    const addStatusToUser = (userId,connected = true) => {
        const updatedUser = directMessages.users.reduce((acc,user)=> {
            if(user.uid === userId){
                user['status'] = `${connected ? 'online' : 'offline'}`
            }
            return acc.concat(user);
        },[])
        setDirectMessages({
            ...directMessages,
            users:updatedUser
        })
    }

    const changeChannel = user => {
        const channelId = getChannelId(user.uid);
        const channelData = {
            id:channelId,
            name:user.name
        }
        console.log(channelData)
        props.setCurrentChannel(channelData)
        props.setPrivateChannel(true);
        setActiveChannel(user.uid)
    }

    const getChannelId = userId => {
        return userId;
    }
    const getListeners = () => {
        if (user) {
            addListeners(user.uid)
        }
    }
    useEffect(getListeners,[])
    return (
        <Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name="mail" /> DIRECT MESSAGES
                </span>{''}
                ({directMessages.users.length})
            </Menu.Item>
            {
                directMessages.users.map(user=> (
                    <Menu.Item
                        key={user.uid}
                        active={user.uid === activeChannel}
                        onClick={() => changeChannel(user)}
                        style={{opacity:0.7,fontStyle:'italic'}}
                        >
                        @{user.name}
                    </Menu.Item>
                ))
            }
        </Menu.Menu>
    )

}

export default connect(
    null,
    {setCurrentChannel,setPrivateChannel}
)(DirectMessages);