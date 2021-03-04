import React from 'react';
import { Grid, Header, Dropdown , Image } from 'semantic-ui-react';
import firebase from '../../firebase'

function UserPanel(props) {
    const handeSignOut = () => {
        firebase
            .auth()
            .signOut()
    }
    const user = props.currentUser.currentUser
    return (
        <Grid style={{ background: '#4c3c4c' }}>
            <Grid.Column style={{ textAlign: "center", marginTop: 10 }}>
                <Grid.Row >
                    <Header inverted as="h2">
                        <Header.Content>React Chat</Header.Content>
                    </Header>
                    <Image src={user.photoURL} spaced="right" avatar />
                    <Dropdown
                        text={user.displayName}
                        floating
                        labeled
                        className='icon' style={{color:"white"}}>
                        <Dropdown.Menu>
                            <Dropdown.Item>Signed in as</Dropdown.Item>
                            <Dropdown.Item>Change Avatar</Dropdown.Item>
                            <Dropdown.Item onClick={handeSignOut}>Sign Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    )
}


export default UserPanel