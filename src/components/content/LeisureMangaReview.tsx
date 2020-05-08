import * as React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { loadArticle } 	from '../../reducers/article';
const DATA = require('../../config.json');

// interface Props {
// 	article: any;
// 	repositoryUrl: string;
// }

// class LeisureMangaReview extends React.Component<Props, {}> {
	class LeisureMangaReview extends React.Component<any, any> {
	img: HTMLImageElement | null;
	constructor(props: any) {
		super(props);
		this.state = {
			article: {},
			isDataFetched: false,
		};
	}

	addDefaultImageUrl(ev: any) {
		// ev.target.src = defaultImage;
		ev.target.className = 'hidden';
	}

	componentDidMount() {
		this._initializeComponent();
	}

	_initializeComponent() {
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;
		let categoryName = this.props.categoryName;
		let path = sitePath + '/' + categoryName;
		let articleName = this.props.articleName;

		console.log('LeisureArticle control');
		console.log(articleType);
		console.log(sitePath);
		console.log(categoryName);
		console.log(path);
		console.log(articleName);

		// first load category if not presented, then use category path for intree parameter 
		// instead article type, so it can load any type of content or category send type info
		// OR only load category if not present with query info + content type AND load dynamically
		// component according to content type AND sub component will load its own "article" content
		this.props.loadArticleContent(path, {
			select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Lead', 'Body', 'RelatedContent', 'Translation', 'Actions'],
			expand: ['CreatedBy', 'Translation', 'RelatedContent', 'Actions'],
			query: 'TypeIs%3A' + articleType + ' AND Name%3A\'' + articleName + '\'',
		}).then((result: any) => {
			console.log('LeisureArticle is loaded. State will be saved now!');			
			this.setState({
				isDataFetched: true,
				article: result.value
			});
		}).catch((err: any) => {
			console.log(err);
		});
	}

	public render() {
		if (!this.state.isDataFetched) {
            return null;
        }

		let article = this.state.article;

        if (article === undefined) {
			return null;
		}

		const TranslationItem = (tLink: any) => (
 			<div key={tLink.item.Id}>
				<div>
					<h4 className="related-title">
						{tLink.item.DisplayName + ' '}
						<a href={tLink.item.BrowseUrl} className={tLink.item.BrowseUrl.length > 0 ? 'show-link' : 'no-link'} target="_blank" title="Letöltés">
							<span className="download-link t-item-icon"><i className="fa fa-download" /></span>
						</a>
						<a href={tLink.item.ReaderUrl} className={tLink.item.ReaderUrl.length > 0 ? 'show-link' : 'no-link'} target="_blank" title="Olvasás online">
							<span className="reader-link t-item-icon"><i className="fa fa-eye" /></span>
						</a>
						<span className="reader-link t-item-icon" title={tLink.item.ReadDirection[0] !== 'leftright' ? 'Olvasási irány: jobbról balra' : 'Olvasási irány: balról jobbra'}>
							<i className={tLink.item.ReadDirection[0] !== 'leftright' ? 'fa fa-arrow-alt-circle-left' : 'fa fa-arrow-alt-circle-right'} />
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
					<h4 className="related-title">
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
						{this.getArticleImage(this.props.repositoryUrl, article)}
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
	getArticleImage(apiUrl: string, article: any) {
		let articleImageAction = article.Actions.find(function (obj: any) { return obj.Name === 'Cover'; });
		
		if (articleImageAction === undefined) {
			return;
		}		
		
		let imagePath = articleImageAction.Url;
		imagePath = apiUrl + imagePath;

		let image = (
			<div className="w3-row-padding w3-padding-16">
				<div className="w3-col m6">
					<img src={imagePath}
						onError={this.addDefaultImageUrl}
						// defaultImageUrl
						className="article-width" />
				</div>
			</div>			
		);
	
		return image;
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
		articles: state.site.articles.articles,
		state: state
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
)(LeisureMangaReview as any);
	