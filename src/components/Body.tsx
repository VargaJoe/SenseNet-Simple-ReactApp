import * as React from 'react';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import {
	Route,
	Switch,
	withRouter
} from 'react-router-dom';

import SiteRoutes from './Nav';

class Body extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			open: false,
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
		return (
				<div>
					<Sidebar openMenu={this.openMenu} menuTrigger={this.state.open ? '' : 'w3-collapse '}/>
					<div className={!this.state.open ? 'sn_overflow hidden' : 'sn_overflow'} onClick={this.openMenu} />
					<div className="w3-overlay w3-hide-large w3-animate-opacity" onClick={this.props.openMenu} />
					<div className="w3-main">
							<Header openMenu={this.openMenu}/>
							<Switch>
								{SiteRoutes.public.map((route, index) => 
								<Route
									key={index}									
									path={route.path}
									exact={route.exact}
									component={route.component}
								/>
								)}								
							</Switch> 
					</div>
				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
	};
};

export default withRouter(connect(
	mapStateToProps,
)(Body as any));
