import * as React from 'react';
// import { PathHelper } from '@sensenet/client-utils';
import { connect } from 'react-redux';
import { loadArticle } from '../reducers/article';

// import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const DATA = require('../config.json');

class Article extends React.Component<any, any> {
	img: HTMLImageElement | null;
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			article: {}
		};
	}

	addDefaultImageUrl(ev: any) {
		// ev.target.src = defaultImage;
		ev.target.className = 'hidden';
	}

	// componentWillReceiveProps(nextProps: any) {	
	// 	// console.log('nextProps');
	// 	console.log(nextProps);
	// 	console.log(this.props);
	// 	if (nextProps.articles !== this.props.articles) {
	// 	this._initializeComponent();
	// 	}
	// }	

	componentDidMount() {
		this._initializeComponent();
	}
	
	_initializeComponent() {
		// let menutType = process.env.REACT_APP_MENU_TYPE || DATA.menuType;
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;		
		let categoryName = this.props.match.params.categoryName;
		// get the current user info
		let path = sitePath + '/' + categoryName;
		// should refactor the query to handle tags as well

		let articleName = this.props.match.params.articleName;
		this.setState({
			articleName: articleName
		});

		let article = this.props.articles.find((obj: any) => obj.Name === articleName );

		if (article === undefined) {
			this.props.loadArticleContent(path, {
				select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Lead', 'Body', 'RelatedContent', 'Translation', 'Actions'],
				expand: ['CreatedBy', 'Translation', 'RelatedContent', 'Actions'],
				query: 'TypeIs:' + articleType + ' AND Name:\'' + articleName + '\'',
			}).then((result: any) => {
				console.log(result);
				this.setState({
					isDataFetched: true,
				});
			}).catch((err: any) => {
				console.log(err);
			});
		}
	}

	public render() {
		// if (!this.state.isDataFetched) {
		// 	return null;
		// }
		// console.log('Props');
		// console.log(this.props);

		let articles = this.props.articles;
		let articleName = this.state.articleName;
		let article = articles.find(function (obj: any) { return obj.Name === articleName; });
		// console.log('wtfart');
		// console.log(articles);
        if (article === undefined) {
			return null;
		}
		
		// console.log(article);
		// console.log('wtfart end');

		// const ImageSection = (image: any) => (
		// 	<div key={image.Id} className="w3-row-padding w3-padding-16">
		// 		{console.log(image)}
		// 		<div className="w3-col m6">
		// 			<img src={this.props.repositoryUrl + image.Url} className="full-width" />
		// 		</div>
		// 	</div>
		//   );

		const TranslationItem = (tLink: any) => (
 			<div key={tLink.item.Id}>
				<div>
					<h4 className="translation-title">
						{tLink.item.DisplayName + ' '}
						<a href={tLink.item.BrowseUrl} title="Letöltés">
							<span className="download-link"><i className="fa fa-download" /></span>
						</a>
						{/* <Link key={'download' + tLink.item} to={tLink.item.BrowseUrl}>
							<span className="download-link">letötés</span>
						</Link> */}{' '}
						<a href={tLink.item.ReaderUrl} target="_blank" title="Olvasás online">
							<span className="reader-link"><i className="fa fa-eye" /></span>
						</a>
						{/* <Link key={'reader' + tLink.item} to={tLink.item.BrowseUrl}>
							<span className="reader-link">olvasás</span>
						</Link> */}{' '}
						<span className="reader-link" title="Olvasási irány: eredeti (jobbról balra)">
							<i className="fa fa-arrow-alt-circle-left" />
						</span>
					</h4>
				</div>
				<div>
					{tLink.item.Description}
				</div>
				<div className="small">
					<span>
						{tLink.item.Author + ' '}
						({tLink.item.Publisher + ', '}
						<Moment date={tLink.item.PublishDate} format="YYYY.MM.DD." />)
					</span>
					{/* <span> 
						Olvasási irány: Eredeti
					</span>				 */}
				</div>
			</div>
		);
		const TranslationContainer = (itemArr = []): any => (
			<div className="w3-container w3-padding-large">
				<h3>Fordítások</h3>
				<ul>
					{
						itemArr.map((item: any = []) => TranslationItem({ item }))
					}
				</ul>
			</div>
		);

		const RelatedItem = (tLink: any) => (
			<div key={tLink.item.Id}>
				<div>
					<h4 className="translation-title">
						{tLink.item.DisplayName + ' '}
						<a href={tLink.item.BrowseUrl} title="Megnyitás" target="_blank">
							<span className="download-link"><i className="fa fa-external-link-alt" /></span>
						</a>
					</h4>
				</div>
				<div>
					{tLink.item.Description}
				</div>
			</div>
		);
		const RelatedContainer = (itemArr = []): any => (
			<div className="w3-container w3-padding-large">
				<h3>Kapcsolódó linkek</h3>
				<ul>
					{
						itemArr.map((item: any = []) => RelatedItem({ item }))
					}
				</ul>
			</div>
		);

		const firstArticle = (
				<div key={article.Id}>
					<div className="w3-container w3-padding-large">
						<h2><b>{article.DisplayName}</b></h2>
					</div>
					{/* {									
						(article.Actions.find(function (obj: any) { return obj.Name === 'Cover'; }) ? ImageSection(article.Actions.find(function (obj: any) { return obj.Name === 'Cover'; })) : '')
					}	 */}
					<div className="w3-row-padding w3-padding-16" key={article.Id}>
						<div className="w3-col m6">
							<img src={this.props.repositoryUrl + this.getArticleImage(article)}
								onError={this.addDefaultImageUrl}
								// defaultImageUrl
								className="full-width" />
						</div>
					</div>
					<div className="w3-container w3-padding-large w3-bottombar">
						{/* <h2><b>{article.DisplayName}</b></h2> */}
						<i>{article.Description}</i>
						<i>{article.Lead}</i>
						<p dangerouslySetInnerHTML={{ __html: article.Body }} />
						<div className="small">
							{article.Author + ' '}
							({article.Publisher + ', '}
							<Moment date={article.PublishDate} format="YYYY.MM.DD." />)
						</div>
					</div>
						{
							article.Translation && article.Translation.length > 0 ? TranslationContainer(article.Translation) : ''
						}
						{
							// (article.RelatedContent ? article.RelatedContent : []).map((item: any = []) => RelatedItem({ item }))
							article.RelatedContent && article.RelatedContent.length > 0 ? RelatedContainer(article.RelatedContent) : ''
						}
				</div>
		);

		return (
			<div>
				{firstArticle}
			</div>
		);
	}
	getArticleImage(article: any): string | undefined {
		let articleImageObj = article.Actions.find(function (obj: any) { return obj.Name === 'Cover'; });
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
		articles: state.site.articles.articles,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		loadArticleContent: (path: string, options: any) => dispatch(loadArticle(path, options)),
    };
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Article as any);
	