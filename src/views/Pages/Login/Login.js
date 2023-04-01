import React, { useState } from 'react';
import { Card, Button } from 'reactstrap';
import { RVForm, RVInput } from '@inftechsol/reactstrap-form-validation';
import Services from './Services';

function Login(props) {
    const [loginObj, setLoginObj] = useState({
        email: '',
        password: ''
    });

    const { setUser, setErtekesito, addNotification } = props;

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setLoginObj({
            ...loginObj,
            [e.target.name]: value
        });
    };

    const submitLoginForm = () => {
        /* e.preventDefault(); */
        Services.login(loginObj, props.isAdmin).then((res) => {
            if (!res.err) {
                localStorage.setItem('refreshToken', res.refreshToken);
                setUser(res.user);
                if (res.ertekesito) {
                    setErtekesito(res.ertekesito);
                }
                window.location.href = '/admin';
                /*  history.push('/admin'); */
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const renderLoginForm = () => {
        return (
            <div className="logincard">
                <Card>
                    <RVForm onSubmit={submitLoginForm} noValidate={true}>
                        <div className="row">
                            <div className="col-md-12">
                                <h4>Bejelentkezés</h4>
                            </div>
                            <br />
                            <br />
                            <div className="col-md-12">
                                <RVInput type="email" name="email" id="email" placeholder="Email cím" onChange={handleInputChange} value={loginObj.email} />
                                <br />
                                <RVInput type="password" name="password" id="password" placeholder="Jelszó" onChange={handleInputChange} value={loginObj.password} />
                                <br />
                                <Button type="submit" color="success">
                                    Bejelentkezés
                                </Button>
                            </div>
                        </div>
                    </RVForm>
                </Card>
            </div>
        );
    };

    return renderLoginForm();
}
export default Login;
