import * as React from 'react';
import { PathHelper } from '@sensenet/client-utils';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import Moment from 'react-moment';

const DATA = require('../config.json');

class Article extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			article: {}
		};
	}

	componentDidMount() {
		let path = PathHelper.joinPaths(DATA.article);
		// get the current user info
		let userGet = this.props.getHomeContent(path, {
			select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Body', 'Actions'],
			expand: ['CreatedBy', 'Actions'],
			query: 'TypeIs:LeisureArticle AND Name:\'' + this.props.match.params.articleName + '\'',
		});

		userGet.then((result: any) => {
			console.log(result.value.entities.entities);
			this.setState({
				isDataFetched: true,
				article: result.value.entities.entities
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

		let article = this.state.article;
		const firstArticle = Object.keys(article).map((key: any) =>
			(
				<div>
					<div className="w3-row-padding w3-padding-16" key={article[key].Id}>
						<div className="w3-col m6">
							<img src={DATA.domain + article[key].Actions.find(function (obj: any) { return obj.Name === 'Cover'; }).Url} className="full-width" />
						</div>
					</div>
					<div className="w3-container w3-padding-large">
						<h4><b>{article[key].DisplayName}</b></h4>
						<i>{article[key].Description}</i>
						<p dangerouslySetInnerHTML={{ __html: article[key].Body }} />
						<div className="small">
							{article[key].Author + ' '}
							({article[key].Publisher + ', '}
							<Moment date={article[key].PublishDate} format="YYYY.MM.DD." />			)
						</div>
					</div>
				</div>
			)
		);

		return (
			<div>
				{firstArticle}
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
	};
};

export default (connect(
	mapStateToProps,
	(dispatch) => ({
		getHomeContent: (path: string, options: any) => dispatch(Actions.requestContent(path, options)),
	})
)(Article as any));