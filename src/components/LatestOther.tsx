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
class LatestOther extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: {}
		};
	}

	componentDidMount() {
		let path1 = PathHelper.joinPaths(DATA.kjk);
		
		// get the current user info
		let itemGet = this.props.getHomeContent(path1, {
			select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate', 'Index', 'Actions'],
			expand: ['CreatedBy', 'Actions'],
			query: 'TypeIs:LeisureArticle .TOP:4',
			orderby: [['PublishDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
		} as IODataParams<LeisureArticle>);

		itemGet.then((result: any) => {
			console.log(result.value.entities.entities);
			this.setState({
				isDataFetched: true,
				articles: result.value.entities.entities,
				ids: result.value.result
			});
		});

		itemGet.catch((err: any) => {
			console.log(err);
		});
	}

	public render() {

		if (!this.state.isDataFetched) {
			return null;
		}

		let fetchedItems = this.state.articles;
		let fetchedIds = this.state.ids;
		const mappedItems = fetchedIds.map((key: number) =>
			(
				<li key={key} className="w3-padding-16">
					<Link to={'/Article/' + fetchedItems[key].Name} className="no-score">
						<img src={DATA.domain + fetchedItems[key].Actions.find(function (obj: any) { return obj.Name === 'HxHImg'; }).Url} className="w3-left w3-margin-right news-img" />
						<span className="w3-large">{fetchedItems[key].DisplayName}</span><br />
						<span className="hidden">{fetchedItems[key].Description}</span>
						<span className="small hidden">{fetchedItems[key].Author}</span>
						<span><Moment date={fetchedItems[key].PublishDate} format="YYYY.MM.DD." /></span>
					</Link>
				</li>
			)
		);

		return (
			<ul className="w3-ul w3-hoverable">
				{mappedItems}
			</ul>
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
)(LatestOther as any));
