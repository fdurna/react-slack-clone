import React from 'react'
import {connect} from 'react-redux';
import { Grid } from 'semantic-ui-react'
import Messages from './Messages/Messages'
import SidePanel from './SidePanel/SidePanel'
import '../_assets/stylesheets/App.css';

const App = ({currentUser,currentChannel, isPrivateChannel}) => (
    <div className="App">
     <Grid columns="equal" className="app" style={{background:'#eee'}}>
       <SidePanel
          key={currentUser && currentUser.uid}
          currentUser={currentUser} 
          />  
        <Grid.Column style={{marginLeft:250}}>
          <Messages
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            currentUser={currentUser}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>
       
     </Grid>
    </div>
)

const mapStateToProps = state => ({
  currentUser:state.user.currentUser,
  currentChannel:state.channel.currentChannel,
  isPrivateChannel:state.channel.isPrivateChannel
})

export default connect(mapStateToProps)(App)