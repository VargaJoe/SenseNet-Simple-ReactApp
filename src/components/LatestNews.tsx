import * as React from 'react';
import { PathHelper } from '@sensenet/client-utils';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import {
	withRouter
} from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const DATA = require('../config.json');

class LeisureArticle extends Folder {
	PublishDate: Date;
}
class LatestNews extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: {}
		};
	}

	componentDidMount() {
		let path1 = PathHelper.joinPaths(DATA.news);

		let itemGet = this.props.getHomeContent(path1, {
			select: ['DisplayName', 'Id', 'Lead', 'Author', 'PublishDate', 'Index', 'Actions'],
			expand: ['Actions'],
			query: 'TypeIs:LeisureArticle .TOP:3',
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
			return (<Loader />);
		}

		let fetchedItems = this.state.articles;
		let fetchedIds = this.state.ids;
		const mappedItems = fetchedIds.map((key: number) =>
			(
				<li key={key} className="w3-padding-16">
				<Link to={'/Article/' + fetchedItems[key].Name} className="no-score">
						<Moment date={fetchedItems[key].PublishDate} format="YYYY.MM.DD. " />:
						{fetchedItems[key].DisplayName}<br />
						<div className="small">{fetchedItems[key].Lead}</div>
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
)(LatestNews as any));
