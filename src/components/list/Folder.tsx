import * as React from 'react';
import { connect } from 'react-redux';
import { loadCategory } from '../../reducers/category';
import { loadArticles } from '../../reducers/articles';
import {
	withRouter
} from 'react-router-dom';
// import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';

const DATA = require('../../config.json');

class CustomArticle extends Folder {
	PublishDate: Date;
}

class FolderAsList extends React.Component<any, any> {
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

		console.log('FolderAsList category:');
		console.log(category);

		console.log('load articles');
		let articlesGet = this.props.loadCategoryArticles(path, {
			select: ['Index', 'DisplayName', 'CreationDate', 'Actions'],
			expand: ['CreatedBy', 'Actions'],
			query: 'TypeIs%3A' + articleType,
			orderby: [['CreationDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
			metadata: 'no'
		} as IODataParams<CustomArticle>);

		articlesGet.then((result: any) => {
			console.log('articles has been loaded');
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
		// let articles = this.props.articles;
		let articles = this.state.articles;
		// let loadedTags = this.props.loadedTags;
		// console.log('wtf');
		// console.log(category);
		// console.log(articles);
		// console.log(articles.length);
		// console.log(loadedTags);
        // if (category === undefined || articles === undefined || articles.length === 0 || !loadedTags.includes(categoryName)) {
		// 	return null;
		// }
		if (category === undefined) {
			return null;
		}
		
		// articles = articles.filter((obj: any) => obj.Path.startsWith(category.Path));
		// console.log('category articles');
		// console.log(articles);
		// console.log(this.props.articles);

		// let homePageItems = this.state.articles;
		// let homePageIds = this.state.ids;
		// let categoryName = this.state.categoryName;
		// let counter = 1;

		// let categories = this.props.categories;
		// let category = categories.filter((c: any) => c.Name === categoryName);
		// let category = categories.find(function (obj: any) { return obj.Name === categoryName; });
		// console.log(categoryName);
		// console.log(categories);
		// console.log(category);
		// console.log(articles);
		// console.log('end');

		// const homePage = '';
		const categoryArticles = articles
			.map((article: any) =>
				(
					<Link key={article.Id} to={'/' + categoryName + '/' + article.Name}>					
						<div data-id={article.Id} className="w3-full w3-container w3-margin-bottom">
							<div className="w3-container w3-white">
								<p><b>{article.DisplayName}</b></p>
								{/* <div className="small">
									<Moment date={article.CreationDate} format="YYYY.MM.DD."/>
								</div> */}
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
)(FolderAsList as any));
