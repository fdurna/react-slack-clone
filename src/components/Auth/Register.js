import React, { useState } from 'react'
import {Link,useHistory} from 'react-router-dom'
import {Grid,Form,Segment,Button,Header,Message} from 'semantic-ui-react'
import {useForm} from 'react-hook-form'
import md5 from 'md5'
import firebase from '../../firebase'

function Register(){
    const { register, handleSubmit,errors,watch} = useForm();
    const [open,setOpen] = useState(false)
    let pwd = watch("password");
    let history = useHistory();
    const [formState,setFormState] = useState({
        username:'',
        email:'',
        password:'',
        passwordconfirmation:'',
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
    const saveUser = (createdUser) => {
        return formState.usersRef.child(createdUser.user.uid).set({
            name:createdUser.user.displayName,
            avatar:createdUser.user.photoURL
        })
    }
    const onSubmit = data => {
        console.log(data);
        setFormState({
            loading:true
        });
        firebase
            .auth()
            .createUserWithEmailAndPassword(data.email,data.password)
            .then(createdUser=>{
                console.log(createdUser)
                createdUser.user.updateProfile({
                    displayName:data.email,
                    photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                .then(()=>{
                    saveUser(createdUser).then(()=>{
                        console.log("user saved")
                    })
                    setFormState({
                        loading:false
                    })
                    setOpen(false)
                    history.push('/login')
                })
                .catch(err=>{
                    console.log(err);
                    setFormState({
                        loading:false
                    })
                })
            })
            .catch(err=>{
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
                    Chat App Register
                </Header>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Segment>
                        <div className={errors.username ? "field error" : "field"}>
                            <input 
                                name="username" 
                                placeholder="Username" 
                                type="text"
                                ref={
                                    register({
                                    required:"You must specify a Username"
                                })} 
                                onChange={handleInputChange} 
                            />
                            <span className="error">{errors.username && errors.username.message}</span>
                        </div>
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
                        <div className={errors.passwordconfirmation ? "field error" : "field"}>
                            <input 
                                name="passwordconfirmation" 
                                placeholder="Password Confirmation" 
                                type="password" 
                                ref={
                                    register({
                                        required:"You must specify a password",
                                        validate: value => value === pwd || "The passwords do not match"
                                })} 
                                onChange={handleInputChange} 
                            />
                            <span className="error">{errors.passwordconfirmation && errors.passwordconfirmation.message}</span>
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
                <Message><span>Already a user? </span><Link to="/login">Login</Link></Message>
            </Grid.Column>
        </Grid>
    )
}

export default Register