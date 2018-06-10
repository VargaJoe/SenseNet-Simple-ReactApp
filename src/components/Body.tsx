import * as React				            from 'react';
import { connect }                          from 'react-redux';
import Sidebar                              from './Sidebar';
import Header                               from './Header';
import {
  	Route,
	Switch,
	withRouter
}                                           from 'react-router-dom';

import Home                                 from './Home';
import Article                              from './Article';
import Reviews                              from './Reviews';
import ReviewsBio                           from './ReviewsBio';
import ReviewsAnime                         from './ReviewsAnime';
import ReviewsKJK                           from './ReviewsKJK';
import ReviewsOther                         from './ReviewsOther';
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
		return (
				<div>
					<Sidebar openMenu={this.props.openMenu}/>
					<div className="w3-overlay w3-hide-large w3-animate-opacity" onClick={this.props.openMenu} />
					<div className="w3-main">
							<Header />
							<Switch>
								<Route 
									exact={true}
									path="/Article/:articleName"
									component={Article}
									
								/>
								<Route 
									exact={true}
									path="/Manga"
									component={Reviews}
								/>  
								<Route 
									exact={true}
									path="/Mangaka"
									component={ReviewsBio}
								/>  
								<Route 
									exact={true}
									path="/Anime és játék"
									component={ReviewsAnime}
								/>  
								<Route 
									exact={true}
									path="/KJK"
									component={ReviewsKJK}
								/>   
								<Route 
									exact={true}
									path="/miegymás"
									component={ReviewsOther}
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
 