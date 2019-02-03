import * as React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';

interface Props {
	article: any;
	repositoryUrl: string;
}

class LeisureMangaReview extends React.Component<Props, {}> {
	img: HTMLImageElement | null;
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
		};
	}

	addDefaultImageUrl(ev: any) {
		// ev.target.src = defaultImage;
		ev.target.className = 'hidden';
	}

	public render() {
		let article = this.props.article;
		
        if (article === undefined) {
			return null;
		}

		const TranslationItem = (tLink: any) => (
 			<div key={tLink.item.Id}>
				<div>
					<h4 className="translation-title">
						{tLink.item.DisplayName + ' '}
						<a href={tLink.item.BrowseUrl} title="Letöltés">
							<span className="download-link"><i className="fa fa-download" /></span>
						</a>
						<a href={tLink.item.ReaderUrl} target="_blank" title="Olvasás online">
							<span className="reader-link"><i className="fa fa-eye" /></span>
						</a>
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
						className="full-width" />
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

export default connect(
	mapStateToProps,
)(LeisureMangaReview as any);
	