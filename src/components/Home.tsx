import * as React from 'react';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import {
	withRouter
} from 'react-router-dom';
import LatestManganime from './LatestManganime';
import LatestOther from './LatestOther';
import LatestNews from './LatestNews';
import Intro from './Intro';

// import Moment from 'react-moment';
class Home extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: {}
		};
	}

	public render() {
		return (
			<div>
			<Intro />
			<div className="w3-row-padding">
				<div className="w3-container w3-padding-large">
					<div className="w3-third">
					<h3>LEGFRISSEBB MANGA/ANIME</h3>					
						<LatestManganime />
					</div>
					<div className="w3-third">
						<h3>HÍREK</h3>
						<LatestNews />
					</div>
					<div className="w3-third">
						<h3>LEGFRISSEBB MIEGYMÁS</h3>
						<LatestOther />
					</div>		
				</div>
			</div>
		</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
	};
};

export default withRouter(connect(
	mapStateToProps,
	(dispatch) => ({
		getHomeContent: (path: string, options: any) => dispatch(Actions.requestContent(path, options)),
	})
)(Home as any));
