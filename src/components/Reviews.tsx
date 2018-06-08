import * as React from 'react';
import Moment from 'react-moment';
// import { PathHelper }                       from '@sensenet/client-utils';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import {
	withRouter
} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';

const DATA = require('../config.json');

class LeisureArticle extends Folder {
	PublishDate: Date;
}

class Reviews extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: {},
			ids: {}
		};
	}

	componentDidMount() {
		// let path = PathHelper.joinPaths(DATA.home);
		let path = DATA.home;
		// get the current user info
		// let userGet = this.props.getHomeContent(path, {
		// 	select : ['Publisher', 'Author', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate'],
		// 	filter : 'isof(\'LeisureArticle\')',
		// 	orderby : ['PublishDate', 'desc']
		// } as IODataParams<LeisureArticle>);

		let userGet = this.props.getHomeContent(path, {
			select: ['Publisher', 'Author', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate', 'Actions'],
			expand: ['CreatedBy', 'Actions'],
			query: 'TypeIs:(LeisureMangaReview LeisureAnimeReview LeisureMangakaBio LeisureGameReview)',
			orderby: [['PublishDate', 'desc'], , 'DisplayName']
		} as IODataParams<LeisureArticle>);

		userGet.then((result: any) => {
			console.log(result.value.entities.entities);
			this.setState({
				isDataFetched: true,
				articles: result.value.entities.entities,
				ids: result.value.result
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
		let homePageIds = this.state.ids;
		let counter = 1;
		const homePage = homePageIds
			.map((key: number) =>
				(
					<Link key={key} to={'/Article/' + homePageItems[key].Name}>					
						<div data-id={counter++} className="w3-third w3-container w3-margin-bottom">
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
		getHomeContent: (path: string, options: any) => dispatch(Actions.requestContent<LeisureArticle>(path, options)),
	})
)(Reviews as any));
