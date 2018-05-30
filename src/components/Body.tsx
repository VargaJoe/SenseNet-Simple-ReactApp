import * as React				            from 'react';
import { connect }                          from 'react-redux';
import Sidebar                              from './Sidebar';
import Header                               from './Header';
import {
  	Route,
	Redirect,
	Switch,
	withRouter
}                                           from 'react-router-dom';
import { LoginState }                       from '@sensenet/client-core';

import MainLayout                           from './MainLayout';
import MainLayout2                          from './MainLayout2';
import MainLayout3                        	from './MainLayout3';
import Home                                 from './Home';
import User                                 from './User';
import Article                              from './Article';
import Reviews                                 from './Reviews';
import Missing                              from './Missing';

class Body extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			open : false,
		},

		this.openMenu = this.openMenu.bind(this);
	}

	openMenu() {
		let menuState = !this.state.open;
		this.setState({         
			open: menuState
		  }); 
	} 

	render() {
		const status = this.props.userLoginState !== LoginState.Authenticated;
	
		return (
				<div className={this.state.open ? 'content_to_right open' : 'content_to_right'}>
					<Header />
					<Sidebar openMenu={this.props.openMenu}/>
					<div className="sn_overflow" onClick={this.props.openMenu} />
					<main className="sn_main">
						<div className="sn_wrapp">
							<Switch>
								<Route 
									exact={true}
									path="/main_layout_1"  
									render={(routerProps) => {
										return status ?
										<Redirect key="login" to="/login" />
										: <MainLayout {...routerProps} />;
									}} 
								/>
								<Route 
									exact={true}
									path="/main_layout_2"
									render={(routerProps) => {
										return status ?
										<Redirect key="login" to="/login" />
										: <MainLayout2 {...routerProps} />;
									}} 
								/>
								<Route 
									exact={true}
									path="/main_layout_3"  
									render={(routerProps) => {
										return status ?
										<Redirect key="login" to="/login" />
										: <MainLayout3 {...routerProps} />;
									}} 
								/>
								<Route 
									exact={true}
									path={'/user/:userName'}
									render={(routerProps) => {
										return status ?
										<Redirect key="login" to="/login" />
										: <User {...routerProps} />;
									}} 
								/>
								<Route 
									exact={true}
									path="/Article/:articleName"
									component={Article}
									
								/>
								<Route 
									exact={true}
									path="/Ismertetők"
									component={Reviews}
								/>    
								<Route 
									exact={true}
									path="/"
									component={Home}
								/>    
								<Route
									component={Missing}
								 />
								
							</Switch> 
						</div>
					</main>
				</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName :              state.sensenet.session.user.userName,
		userLoginState: 		state.sensenet.session.loginState, // state.user.user.FullName,
	};
};

export default withRouter(connect(
	mapStateToProps,
)(Body as any));
 