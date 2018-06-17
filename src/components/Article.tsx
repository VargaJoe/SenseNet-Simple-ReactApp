import * as React from 'react';
import { PathHelper } from '@sensenet/client-utils';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
// import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const DATA = require('../config.json');
// const defaultImage = require('../images/logo.png');

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

	componentDidMount() {
		let path = PathHelper.joinPaths(DATA.article);
		// get the current user info
		let userGet = this.props.getHomeContent(path, {
			select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Body', 'RelatedContent', 'Translation', 'Actions'],
			expand: ['CreatedBy', 'Translation', 'RelatedContent', 'Actions'],
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

		// const ImageSection = (image: any) => (
		// 	<div key={image.Id} className="w3-row-padding w3-padding-16">
		// 		{console.log(image)}
		// 		<div className="w3-col m6">
		// 			<img src={DATA.domain + image.Url} className="full-width" />
		// 		</div>
		// 	</div>
		//   );

		const TranslationItem = (tLink: any) => (
			<div key={ tLink.item.Id }>
				<div>
					<h4 className="translation-title">
						{ 'Fordítás: ' + tLink.item.DisplayName + ' ' }
						<a href={tLink.item.BrowseUrl} title="Letöltés">
							<span className="download-link"><i className="fa fa-download"/></span>
						</a>
						{/* <Link key={'download' + tLink.item} to={tLink.item.BrowseUrl}>
							<span className="download-link">letötés</span>
						</Link> */}{' '}			
						<a href={tLink.item.ReaderUrl} target="_blank" title="Olvasás online">
							<span className="reader-link"><i className="fa fa-eye"/></span>
						</a>
						{/* <Link key={'reader' + tLink.item} to={tLink.item.BrowseUrl}>
							<span className="reader-link">olvasás</span>
						</Link> */}{' '}
						<span className="reader-link" title="Olvasási irány: eredeti (jobbról balra)">
							<i className="fa fa-caret-square-o-left"/>
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

		  const RelatedItem = (tLink: any) => (
			<div key={ tLink.item.Id }>
				<div>
					<h4 className="translation-title">
						{ 'Kapcsolódó: ' + tLink.item.DisplayName + ' ' }
						<a href={tLink.item.BrowseUrl} title="Megnyitás" target="_blank">
							<span className="download-link"><i className="fa fa-external-link"/></span>
						</a>
					</h4>					
				</div>
				<div>
					{tLink.item.Description}
				</div>
			</div>
		  );
		// const TranslationList = (translations = []) => (
		// <div>
		// 	<hr/>
		// 	<h3>Fordítások</h3>
		// 	<ul>
		// 	{translations.map((item: any) => TranslationItem({ item }))}
		// 	</ul>
		// </div>
		// );
		const firstArticle = Object.keys(article).map((key: any) =>
			(
				<div key={key}>
					<div className="w3-container w3-padding-large">
						<h2><b>{article[key].DisplayName}</b></h2>
					</div>
					{/* {									
						(article[key].Actions.find(function (obj: any) { return obj.Name === 'Cover'; }) ? ImageSection(article[key].Actions.find(function (obj: any) { return obj.Name === 'Cover'; })) : '')
					}	 */}
					<div className="w3-row-padding w3-padding-16" key={article[key].Id}>
						<div className="w3-col m6">
							<img src={DATA.domain + article[key].Actions.find(function (obj: any) { return obj.Name === 'Cover'; }).Url} 
							onError={this.addDefaultImageUrl}
							// defaultImageUrl
							className="full-width" />
						</div>
					</div>
					<div className="w3-container w3-padding-large w3-bottombar">
						{/* <h2><b>{article[key].DisplayName}</b></h2> */}
						<i>{article[key].Description}</i>
						<p dangerouslySetInnerHTML={{ __html: article[key].Body }} />
						<div className="small">
							{article[key].Author + ' '}
							({article[key].Publisher + ', '}
							<Moment date={article[key].PublishDate} format="YYYY.MM.DD." />)
						</div>										
					</div>	
					<div className="w3-container w3-padding-large">
					{									
						(article[key].Translation ? article[key].Translation : []).map((item: any = []) => TranslationItem({ item }))
					}	
					</div>
					<div className="w3-container w3-padding-large">
					{									
						(article[key].RelatedContent ? article[key].RelatedContent : []).map((item: any = []) => RelatedItem({ item }))
					}	
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