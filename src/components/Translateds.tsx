import * as React 		from 'react';
import { connect } 		from 'react-redux';
import { loadCategory } from '../reducers/category';
import { loadTranslatedManga } from '../reducers/articles';
import {
	withRouter
} 						from 'react-router-dom';
import Moment 			from 'react-moment';
import { Link } 		from 'react-router-dom';
import { 
	Folder } 			from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';
import { Helmet } 		from 'react-helmet';

const DATA = require('../config.json');
let siteTitle = process.env.REACT_APP_SITE_TITLE || DATA.siteTitle;

class CustomArticle extends Folder {
	PublishDate: Date;
}

class Translateds extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			categoryName: '',
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
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;		
		let path = sitePath + '/Manga';

		this.setState({
				categoryName: 'Manga'
		});

		let articles = this.props.articles;

		if (articles === undefined || articles === [] || articles.length === 0) {
			console.log('load only articles');
			let articlesGet = this.props.loadCategoryArticles(path, {
				select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Lead', 'Body', 'RelatedContent', 'Translation', 'Actions'],
				expand: ['CreatedBy', 'Translation', 'RelatedContent', 'Actions'],
				query: 'TypeIs%3A' + articleType,
				orderby: [['PublishDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
				metadata: 'no'
			} as IODataParams<CustomArticle>);

			articlesGet.then((result: any) => {
				console.log('articles loaded');
				console.log(result.value);
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
        if (category === undefined || articles === undefined || articles.length === 0 || !loadedTags.includes(categoryName)) {
			return null;
		}
		
		articles = articles.filter((obj: any) => obj.Path.startsWith(`${category.Path}/`));
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
			<div>
				<Helmet>
					<meta charSet="utf-8" />
					<title>{siteTitle} - {category.DisplayName}</title>
					{/* concat title from site name + article name */}
					<link rel="canonical" href={`${window.location.href}`} />
					{/* concat url from article domain + article category + article name */}
					{/* ${window.location.host}/${this.state.categoryName}/${this.state.articleName} */}
				</Helmet>
				<div className="w3-container"><h1><b>{category.DisplayName}</b></h1></div>
				<div className="w3-row-padding">
					{categoryArticles} 
				</div>
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
		loadCategoryArticles: (path: string, options: any) => dispatch(loadTranslatedManga(path, options)),
    };
};

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(Translateds as any));
