import React, { useState, useEffect } from 'react';
import { Menu, Icon, Modal, Form, Button } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import {connect} from 'react-redux';
import {setCurrentChannel,setPrivateChannel} from '../../_actions'
import firebase from '../../firebase';

function Channels(props) {
    const user = props.currentUser.currentUser.currentUser
    const { handleSubmit, register } = useForm();
    const [open, setOpen] = useState(false)
    const [channelsForm, setChannelsForm] = useState({
        activeChannel:'',
        channels: [],
        channelname: '',
        channeldetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad:true
    })
    const closeModal = () => setOpen(false)
    const openModal = () => setOpen(true)
    const getChannelList = () => {
        let loadedChannels = [];
        channelsForm.channelsRef.on('child_added', items => {
            loadedChannels.push(items.val());
            setFirstChannel(loadedChannels)
            setChannelsForm({
                ...channelsForm,
                channels: loadedChannels,
            })
        })
    }
    const setFirstChannel = (channel) => {
        const firstChannel = channel[0]
        if( channelsForm.firstLoad && channel.length>0){
            props.setCurrentChannel(firstChannel)
        }
        setChannelsForm({
            firstLoad:false,
            channels: channel,
        })
    }
    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setChannelsForm({
            ...channelsForm,
            [name]: value
        })
    }
    const onSubmit = data => {
        console.log(data);
        const key = channelsForm.channelsRef.push().key;
        console.log(key)
        const newChannel = {
            id: key,
            name: data.channelname,
            details: data.channeldetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }
        channelsForm.channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                setOpen(false)
                console.log("channel added")
            })
            .catch(err => {
                console.log(err)
            })
    }
    const channelChange = (item) => {
        setActiveChannel(item)
        props.setCurrentChannel(item)
        props.setPrivateChannel(false)
    }
    const setActiveChannel = (item) => {
        console.log(item)
        setChannelsForm({
            ...channelsForm,
            activeChannel:item.id
        })
    }
    useEffect(getChannelList, [])
    return (
        <div>
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="exchange" />
                        CHANNELS
                    </span>
                    ({channelsForm.channels.length})
                    <Icon name="add" onClick={openModal} />
                </Menu.Item>
                {channelsForm.channels.map(item => 
                    <Menu.Item
                        onClick={()=>channelChange(item)}
                        key={item.id}
                        name={item.name}
                        style={{ opacity: 0.7 }}
                        active={item.id === channelsForm.activeChannel}>
                        # {item.name}
                    </Menu.Item>
                )}
            </Menu.Menu>
            <Modal basic open={open} onClose={closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Field>
                            <input
                                placeholder="Name of Channel"
                                name="channelname"
                                onChange={handleInputChange}
                                ref={register({ required: true })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <input
                                placeholder="About the Channel"
                                name="channeldetails"
                                onChange={handleInputChange}
                                ref={register({ required: true })}
                            />
                        </Form.Field>
                        <Button color="green" inverted type="Submit">
                            <Icon name="checkmark" />
                            Add
                        </Button>
                        <Button color="red" inverted onClick={closeModal}>
                            <Icon name="remove" />
                            Cancel
                        </Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </div>

    )
}

export default connect(
    null, 
    {setCurrentChannel,setPrivateChannel}
)(Channels);
