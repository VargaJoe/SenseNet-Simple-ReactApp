import * as React from 'react';
import { connect } from 'react-redux';
import { loadCategory } from '../../reducers/category';
import { loadArticles } from '../../reducers/articles';
import {
	withRouter
} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';

const DATA = require('../../config.json');

class FolderList extends React.Component<any, any> {
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

		console.log('FOLDERLIST: inner category:');
		console.log(category);

		console.log('FOLDERLIST: load articles');
		let articlesGet = this.props.loadCategoryArticles(path, {
			select: ['Index', 'DisplayName', 'Actions'],
			query: 'TypeIs%3A' + articleType,
			orderby: [['Index', 'desc'], 'DisplayName'],
			metadata: 'no'
		} as IODataParams<Folder>);

		articlesGet.then((result: any) => {
			console.log('FOLDERLIST: articles has been loaded');
			console.log(result);
			this.setState({
				isDataFetched: true,
				articles: result.value.articles.results
			});
		}).catch((err: any) => {
			console.log('FOLDERLIST: error on articles load');
			console.log(err);
		});
	}

	public render() {
		let categoryName = this.state.categoryName;
		let category = this.props.category;
		let articles = this.state.articles;

		// console.log('FOLDERLIST: wtf');
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
						<div data-id={article.Id} className="w3-full w3-container w3-margin-bottom">
							<div className="w3-container w3-white">
								<p><b>{article.DisplayName}</b></p>
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
)(FolderList as any));
