import * as React                   from 'react';
import logo				 	        from '../images/logo.png';

interface Props {
    formSubmit: any;
}

interface State {
    emailInput: string;
    passwordInput: string;
    error: boolean;
    emailValid: boolean;
    passwordValid: boolean;
}

export class Login extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            emailInput: '', 
            emailValid: true,
            error: false,
            passwordInput: '',
            passwordValid: true,
            
        },

        this.onSubmit               = this.onSubmit.bind(this);
        this.handleUserEmail        = this.handleUserEmail.bind(this);
        this.handleUserPassword     = this.handleUserPassword.bind(this);
    }
    
    public onSubmit = (e: any) => {
        e.preventDefault();
        this.props.formSubmit(e, this.state.emailInput, this.state.passwordInput);
    }

    public handleUserEmail = (e: any) => {
        const emailValid = e.target.value.match(/^[A-Za-z\s0-9\\]+$/);
        this.setState({
            emailInput: e.target.value,
        });
        if ( emailValid && e.target.value.length > 0) {
            this.setState({
                emailValid: true
            });
        } else {
            this.setState({
                emailValid: false,
                error: true,
                
            });
        }
    }

    public handleUserPassword = (e: any) => {
        const regex = /^[A-Za-z\s0-9\\]+$/;
        const special = !e.target.value.match(/[!@#$%\^&*\+]/);
        const passwordValid = regex.test(e.target.value) && special ? true : false;
        this.setState({
            passwordInput: e.target.value,
        });
        if ( passwordValid ) {
            this.setState({
                passwordValid: true
            });
            
        } else {
            this.setState({
                error: true,
                passwordValid: false
            });
        }
    }

    public handleBlur = () => {
        if (this.state.emailValid && this.state.passwordValid) {
            this.setState({
                error: false
            });
        }
    }

    public render () {
        return (
            <div className="fix_block">
                <img src={logo} alt="site logo" />
                <div className="login_page">
                    <h1>Login</h1>
                    <form onSubmit={e => { this.onSubmit(e); }}>
                        <input 
                            type="text" 
                            required={true} 
                            placeholder="loginname" 
                            name="email"
                            data-testid="email"
                            onChange={this.handleUserEmail}
                            value={this.state.emailInput}
                            onBlur={this.handleBlur}
                        />
                        <input 
                            type="password" 
                            required={true} 
                            placeholder="password" 
                            name="password"
                            className="login__password"
                            data-testid="password"
                            onChange={this.handleUserPassword}
                            value={this.state.passwordInput}
                            onBlur={this.handleBlur}
                        />
                        <button 
                            className="sn_btn"
                            id="submitLoginForm"
                            disabled={this.state.passwordValid && this.state.emailValid ? false : true}
                        >
                            login
                        </button>
                        { this.state.error ? 
                            ( 
                                <div className="error">
                                    Values atre not valid
                                </div>
                            )
                            :
                            ( '' )
                        }
                    </form>
                </div>
            </div>
        );
    }
}

export default Login; 