import React from 'react';
import {Header,Segment,Input,Icon} from 'semantic-ui-react';


function MessagesHeader(props){
    const channelName = props.channelName
    const numUniqueUsers = props.numUniqueUsers
    const handleSearchChange = props.handleSearchChange
    const isPrivateChannel = props.isPrivateChannel
    return(
        <Segment clearing>
            <Header fluid="true" as="h2" floated="left" style={{marginBottom:0}}>
                <span>
                {channelName} 
                {isPrivateChannel ? '' : <Icon name={"star outline"} color="black" />}
                </span>
                <Header.Subheader>{numUniqueUsers}</Header.Subheader>
            </Header>
            <Header floated="right">
                <Input
                    onChange={handleSearchChange}
                    size="mini"
                    icon="search"
                    name="searchTerm"
                    placeholder="Search Messages"
                />
            </Header>
        </Segment>
    )   
}

export default MessagesHeader;