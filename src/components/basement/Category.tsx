import * as React from 'react';
import { connect } from 'react-redux';
import { loadCategory } from '../../reducers/category';
import { loadArticles } from '../../reducers/articles';
import {
	withRouter
} from 'react-router-dom';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { GenericContent, Folder } from '@sensenet/default-content-types';
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

	componentWillReceiveProps(nextProps: any) {		
		if (nextProps.match.params.categoryName !== this.props.match.params.categoryName) {
			this._initializeComponent(nextProps.match.params.categoryName);
		}						
	}	

	componentDidMount() {
		this._initializeComponent(this.props.match.params.categoryName);
	}
	
	_initializeComponent(categoryName: string) {
		let menutType = process.env.REACT_APP_MENU_TYPE || DATA.menuType;
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;		
		let path = sitePath + '/' + categoryName;

		this.setState({
				categoryName: categoryName
		});

		let category = this.props.categories.find((obj: any) => obj.Name === categoryName );
		let articles = this.props.articles;
		let loadedTags = this.props.loadedTags;

		if (category === undefined && (articles === undefined || articles === [] || articles.length === 0 || !loadedTags.includes(categoryName))) {
			console.log('category + articles');

			let categoryGet = this.props.loadCategoryContent(path, {
				select: ['Name', 'IconName', 'Id', 'Path', 'Index', 'DisplayName'],
				query: 'Type%3A' + menutType + ' AND Hidden%3A0 .AUTOFILTERS:OFF',
				orderby: ['Index', 'DisplayName']
			} as IODataParams<GenericContent>);
	
			categoryGet.then(() => {
				let articlesGet = this.props.loadCategoryArticles(path, {
					// select: ['Publisher', 'Author', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate', 'Index', 'Actions'],
					select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Lead', 'Body', 'RelatedContent', 'Translation', 'Actions'],
					expand: ['CreatedBy', 'Actions/HxHImg'],					
					query: 'TypeIs%3A' + articleType,
					orderby: [['PublishDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
					metadata: 'no'
				} as IODataParams<CustomArticle>);

				articlesGet.then((err: any) => {
					console.log('Load category + articles');
				}).catch((err: any) => {
					console.log(err);
				});
			}).catch((err: any) => {
				console.log(err);
			});
		} else if (articles === undefined || articles === [] || articles.length === 0 || !loadedTags.includes(categoryName)) {
			console.log('only articles');
			let articlesGet = this.props.loadCategoryArticles(path, {
				// select: ['Publisher', 'Author', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate', 'Index', 'Actions'],
				select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Lead', 'Body', 'RelatedContent', 'Translation', 'Actions'],
				expand: ['CreatedBy', 'Actions/HxHImg'],					
				query: 'TypeIs%3A' + articleType,
				orderby: [['PublishDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
				metadata: 'no'
			} as IODataParams<CustomArticle>);

			articlesGet.then((err: any) => {
				console.log('Load only articles');
			}).catch((err: any) => {
				console.log(err);
			});
		}		
	}

	public render() {
		let categoryName = this.state.categoryName;
		let categories = this.props.categories;
		let category = categories.find(function (obj: any) { return obj.Name === categoryName; });
		let articles = this.props.articles;
		let loadedTags = this.props.loadedTags;
		// console.log('wtf');
		// console.log(category);
		// console.log(articles);
		// console.log(articles.length);
		// console.log(loadedTags);
        if (category === undefined || articles === undefined || articles.length === 0 || !loadedTags.includes(categoryName)) {
			return null;
		}
		
		articles = articles.filter((obj: any) => obj.Path.startsWith(category.Path));
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
						<div data-id={article.Id} className="w3-third w3-container w3-margin-bottom">
							<img src={this.props.repositoryUrl + this.getArticleImage(article)} className="w3-hover-opacity full-width" />
							<div className="w3-container w3-white">
								<p><b>{article.DisplayName}</b></p>
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
)(Category as any));
