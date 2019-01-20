import * as React from 'react';
// import { Route } from 'react-router-dom';

import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import Moment from 'react-moment';

const DATA = require('../config.json');

class Intro extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			article: {}
		};
	}

	componentDidMount() {
		this._initializeComponent();
	}
	
	_initializeComponent() {
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let path = process.env.REACT_APP_SITE_WELCOME || DATA.siteWelcome;		

		if (path !== undefined) {
			let userGet = this.props.getWelcomeContent(path, {
				select: ['DisplayName', 'Id', 'Author', 'PublishDate',  'Lead', 'Actions'],
				expand: ['CreatedBy', 'Actions/HxHImg'],
				query: 'TypeIs:' + articleType,
				metadata: 'no',

			} as any);

			userGet.then((result: any) => {
				console.log(result.value.d);
				this.setState({
					isDataFetched: true,
					article: result.value.d
				});
			});

			userGet.catch((err: any) => {
				console.log(err);
			});
		}
	}

	public render() {
		if (!this.state.isDataFetched) {
			return null;
		}

		let introItem = this.state.article;

		const welcomeMessage = introItem ? (
					<div>
						<div className="lead">
							{introItem.Lead}
						</div>
						<div className="small">{introItem.Author} (<Moment date={introItem.PublishDate} format="YYYY" />)</div>
					</div>
			) : '';

		return (
			<div className="w3-container w3-bottombar">
				 {welcomeMessage ? welcomeMessage : DATA.siteLead}
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
	};
};

export default (connect(
	mapStateToProps,
	(dispatch) => ({
		getWelcomeContent: (path: string, options: any) => dispatch(Actions.loadContent(path, options)),
	})
)(Intro as any));
