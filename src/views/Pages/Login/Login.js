import React, { useState } from 'react';
import { Card, Button, Form, Input } from 'reactstrap';
import Services from './Services';

function Login(props) {
    const [loginObj, setLoginObj] = useState({
        email: '',
        password: ''
    });

    const { setUser, setErtekesito, history, addNotification } = props;

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setLoginObj({
            ...loginObj,
            [e.target.name]: value
        });
    };

    const submitLoginForm = (e) => {
        e.preventDefault();
        Services.login(loginObj, props.isAdmin).then((res, err) => {
            if (!err) {
                localStorage.setItem('refreshToken', res.refreshToken);
                setUser(res.user);
                if (res.ertekesito) {
                    setErtekesito(res.ertekesito);
                }
                history.push('/admin');
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const renderLoginForm = () => {
        return (
            <div className="logincard">
                <Card>
                    <Form onSubmit={submitLoginForm}>
                        <div className="row">
                            <div className="col-md-12">
                                <h4>Bejelentkezés</h4>
                            </div>
                            <br />
                            <br />
                            <div className="col-md-12">
                                <Input type="email" name="email" id="email" placeholder="Email cím" onChange={handleInputChange} value={loginObj.email} />
                                <br />
                                <Input type="password" name="password" id="password" placeholder="Jelszó" onChange={handleInputChange} value={loginObj.password} />
                                <br />
                                <Button type="submit" color="success">
                                    Bejelentkezés
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        );
    };

    return renderLoginForm();
}
export default Login;
