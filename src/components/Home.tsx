import * as React from 'react';
import { PathHelper } from '@sensenet/client-utils';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import {
	withRouter
} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';
const DATA = require('../config.json');

import Moment from 'react-moment';
class LeisureArticle extends Folder {
	PublishDate: Date;
}
class Home extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: {}
		};
	}

	componentDidMount() {
		let path = PathHelper.joinPaths(DATA.home);
		// get the current user info
		let userGet = this.props.getHomeContent(path, {
			select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate', 'Actions'],
			expand: ['CreatedBy', 'Actions'],
			query: 'TypeIs:LeisureArticle .TOP:3',
			orderby: [['PublishDate', 'desc'], , 'DisplayName'],
		} as IODataParams<LeisureArticle>);

		userGet.then((result: any) => {
			console.log(result.value.entities.entities);
			this.setState({
				isDataFetched: true,
				articles: result.value.entities.entities
			});
		});

		userGet.catch((err: any) => {
			console.log(err);
		});
	}

	public render() {

		if (!this.state.isDataFetched) {
			return null;
		}

		let homePageItems = this.state.articles;
		const homePage = Object.keys(homePageItems).map((key: any) =>
			(
				<Link key={key} to={'/Article/' + homePageItems[key].Name}>
					<div className="w3-third w3-container w3-margin-bottom">
						<img src={DATA.domain + homePageItems[key].Actions.find(function (obj: any) { return obj.Name === 'HxHImg'; }).Url} className="w3-hover-opacity full-width" />
						<div className="w3-container w3-white">
							<p><b>{homePageItems[key].DisplayName}</b></p>
							<p className="hidden">{homePageItems[key].Description}</p>
							<div className="small hidden">{homePageItems[key].Author}</div>
							<div className="small hidden">
								<Moment format="YYYY.MM.DD.">
									{homePageItems[key].PublishDate}
								</Moment>
							</div>
						</div>
					</div>
				</Link>
			)
		);

		return (
			<div className="w3-row-padding">
				<h4>Legfrissebbek</h4>
				{homePage}
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
