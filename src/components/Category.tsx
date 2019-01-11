import * as React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import {
	withRouter
} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';

const DATA = require('../config.json');

class CustomArticle extends Folder {
	PublishDate: Date;
}

class Category extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: Array,
			ids: {},
			categoryName: ''			
		};
	}

    // byName = () => {
	// 	this.setState({
	// 		articles: this.state.articles.map((item: any) => item).sort((a: any, b: any) => a.PublishDate < b.PublishDate)
	// 	});
	//  }

	//  byDate = () => {
		 
	// 	this.setState({
	// 		articles: this.state.articles.map((item: any) => item).sort((a: any, b: any) => a.PublishDate < b.PublishDate)
	// 	});
	//  }

	componentWillReceiveProps(nextProps: any) {		
		if (nextProps.match.params.categoryName !== this.props.match.params.categoryName) {
			this._initializeComponent(nextProps.match.params.categoryName);
		}						
	}	

	componentDidMount() {
		this._initializeComponent(this.props.match.params.categoryName);
	}
	
	_initializeComponent(categoryName: string) {
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;		
		let baseCatcontainerPath = 'infos/';
		let path = sitePath + '/' + baseCatcontainerPath + categoryName;

		let userGet = this.props.getHomeContent(path, {
			select: ['Publisher', 'Author', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate', 'Index', 'Actions'],
			expand: ['CreatedBy', 'Actions/HxHImg'],
			query: 'TypeIs:' + articleType,
			orderby: [['PublishDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
			metadata: 'no'
		} as IODataParams<CustomArticle>);

		userGet.then((result: any) => {
			console.log(result.value.entities.entities);
			this.setState({
				isDataFetched: true,
				articles: result.value.entities.entities,
				ids: result.value.result,
				categoryName: categoryName
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
		let categoryName = this.state.categoryName;
		let counter = 1;

		const homePage = homePageIds
			.map((key: number) =>
				(
					<Link key={key} to={'/' + categoryName + '/' + homePageItems[key].Name}>					
						<div data-id={counter++} className="w3-third w3-container w3-margin-bottom">
							<img src={this.props.repositoryUrl + this.getArticleImage(homePageItems[key])} className="w3-hover-opacity full-width" />
							<div className="w3-container w3-white">
								<p><b>{homePageItems[key].DisplayName}</b></p>
								<p className="hidden">{homePageItems[key].Description}</p>
								<div className="small hidden">{homePageItems[key].Author}</div>
								<div className="small hidden">
									<Moment date={homePageItems[key].PublishDate} format="YYYY.MM.DD."/>
								</div>
							</div>							
						</div>
					</Link>
				)
			);

		return (
			<div className="w3-row-padding">
				{/* <div> 
					<button onClick={this.byName}>byName</button>
				</div>
				<div> 
					<button onClick={this.byDate}>byDate</button>
				</div> */}
				{homePage} 
			</div>
		);
	}
	getArticleImage(article: any): any {
		let articleImageObj = article.Actions.find(function (obj: any) { return obj.Name === 'HxHImg'; });
		let articleImage = '';
		if (articleImageObj) {
			articleImage = articleImageObj.Url;
		}
		return articleImage;
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
	};
};

export default withRouter(connect(
	mapStateToProps,
	(dispatch) => ({
		getHomeContent: (path: string, options: any) => dispatch(Actions.requestContent<CustomArticle>(path, options)),
	})
)(Category as any));
