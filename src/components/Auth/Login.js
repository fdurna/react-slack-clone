import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import {Grid,Form,Segment,Button,Header,Message} from 'semantic-ui-react'
import {useForm} from 'react-hook-form'
import firebase from '../../firebase'

function Login(){
    const { register, handleSubmit,errors} = useForm();
    const [open,setOpen] = useState(false)
    const [formState,setFormState] = useState({
        email:'',
        password:'',
        loading:false,
        messageTitle:'',
        messageInfo:'',
        usersRef:firebase.database().ref('users')
    })
    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        setFormState({
            ...formState,
            [name]:value
        })
        console.log(formState)
    }
    const onSubmit = data => {
        console.log(data);
        setFormState({
            loading:true
        });
        firebase
            .auth()
            .signInWithEmailAndPassword(data.email,data.password)
            .then(signedInUser => {
                console.log(1)
                console.log(signedInUser)
            })
            .catch(err=>{
                console.log(2)
                console.log(err)
                setFormState({
                    loading:false,
                    messageInfo:err.message,
                    messageTitle:"Error"
                })
                setOpen(true)
            })
    }
    return(
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{maxWidth:450}}>
                <Header as="h2" icon color="blue" textAlign="center">
                    Chat App Login
                </Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Segment>
                        <div className={errors.email ? "field error" : "field"}>
                            <input 
                                name="email" 
                                placeholder="Email" 
                                type="email" 
                                ref={
                                    register({
                                    required:"You must specify a Email",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    }
                                })} 
                                onChange={handleInputChange} 
                            />
                            <span className="error">{errors.email && errors.email.message}</span>
                        </div>
                        <div className={errors.password ? "field error" : "field"}>
                            <input 
                                name="password" 
                                placeholder="Password" 
                                type="password" 
                                ref={
                                    register({
                                        required:"You must specify a password",
                                })} 
                                onChange={handleInputChange} 
                            />
                            <span className="error">{errors.password && errors.password.message}</span>
                        </div>
                        <Button type="submit" color="blue" size="large" disabled={formState.loading} className={formState.loading ? 'loading' : ''}>Submit</Button>
                    </Segment>
                </Form>
                {
                    open ? 
                    <Message error>
                        <h3>{formState.messageTitle}</h3>
                        <span>{formState.messageInfo}</span>
                    </Message> : ''
                }
                <Message><Link to="/register">Sign up</Link></Message>
            </Grid.Column>
        </Grid>
    )
}

export default Login