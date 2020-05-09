import * as React from 'react';
import { connect } from 'react-redux';
import { loadCategory } from '../../reducers/category';
import { loadArticles } from '../../reducers/articles';
import {
	withRouter
} from 'react-router-dom';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';
import ProgressiveImage from 'react-progressive-graceful-image';

const DATA = require('../../config.json');

class CustomArticle extends Folder {
	PublishDate: Date;
}

class LeisureCategoryList extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			articles: [],
			isDataFetched: false,
			ids: {},
			categoryName: ''
		};
	}

	componentWillReceiveProps(nextProps: any) {		
		if (nextProps.match.params.categoryName !== this.props.match.params.categoryName) {
			this._initializeComponent(nextProps.category);
		}						
	}	

	componentDidMount() {
		this._initializeComponent(this.props.category);
	}
	
	_initializeComponent(category: any) {
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;		
		let path = sitePath + '/' + category.Name;

		this.setState({
				categoryName: category.Name
		});

		console.log('LEISURECATEGORYLIST: inner category:');
		console.log(category);

		console.log('LEISURECATEGORYLIST: load articles');
		let articlesGet = this.props.loadCategoryArticles(path, {
			select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Lead', 'Body', 'RelatedContent', 'Translation', 'Actions'],
			expand: ['CreatedBy',  'Translation', 'Actions/HxHImg'],					
			query: 'TypeIs%3A' + articleType,
			orderby: [['PublishDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
			metadata: 'no'
		} as IODataParams<CustomArticle>);

		articlesGet.then((result: any) => {
			console.log('LEISURECATEGORYLIST: articles has been loaded');
			console.log(result);
			this.setState({
				isDataFetched: true,
				articles: result.value.articles.results
			});
		}).catch((err: any) => {
			console.log(err);
		});
	}

	public render() {
		let categoryName = this.state.categoryName;
		let category = this.props.category;
		let articles = this.state.articles;
		// console.log('LEISURECATEGORYLIST: wtf');
		// console.log(category);
		// console.log(articles);
		// console.log(articles.length);
		// console.log(loadedTags);

		if (category === undefined) {
			return null;
		}

		const categoryArticles = articles
			.map((article: any) =>
				(
					<Link key={article.Id} to={'/' + categoryName + '/' + article.Name}>					
						<div data-id={article.Id} className="w3-quarter w3-container w3-margin-bottom">
							{/* <img src={this.props.repositoryUrl + this.getArticleImage(article)} className="w3-hover-opacity full-width" /> */}
							<ProgressiveImage
								src={this.props.repositoryUrl + this.getArticleImage(article)}
								placeholder={this.props.repositoryUrl + '/(structure)/Site/sample.png'}
							>
								{(src: string) => <img src={src} alt={article.DisplayName} className="w3-hover-opacity full-width" />}
							</ProgressiveImage>
							<div className="w3-container w3-white list-box-title">
								<p><b>{article.DisplayName}</b>
								<span className={article.Translation != null && article.Translation.length > 0 ? 'show-icon' : 'hide-icon'}><i className="fa fa-download" /></span>
								</p>
								<p className="hidden">{article.Description}</p>
								<div className="small hidden">{article.Author}</div>
								<div className="small hidden">
									<Moment date={article.PublishDate} format="YYYY.MM.DD."/>
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
				{categoryArticles} 
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
		categories: state.site.categories.categories,
		articles: state.site.articles.articles,
		loadedTags: state.site.articles.loadedTags,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		loadCategoryContent: (path: string, options: any) => dispatch(loadCategory(path, options)),
		loadCategoryArticles: (path: string, options: any) => dispatch(loadArticles(path, options)),
    };
};

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(LeisureCategoryList as any));
