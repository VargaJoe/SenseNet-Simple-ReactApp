import * as React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { loadArticle } 	from '../../reducers/article';
const DATA = require('../../config.json');

class GenericContent extends React.Component<any, any> {
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

		// console.log('GENERICCONTENT: LeisureArticle control');
		// console.log(articleType);
		// console.log(sitePath);
		// console.log(categoryName);
		// console.log(path);
		// console.log(articleName);

		// first load category if not presented, then use category path for intree parameter 
		// instead article type, so it can load any type of content or category send type info
		// OR only load category if not present with query info + content type AND load dynamically
		// component according to content type AND sub component will load its own "article" content
		this.props.loadArticleContent(path, {
			select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'Actions'],
			expand: ['CreatedBy', 'Actions'],
			query: 'TypeIs%3A' + articleType + ' AND Name%3A\'' + articleName + '\'',
		}).then((result: any) => {
			console.log('GENERICCONTENT: Article is loaded. State will be saved now!');			
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

		const firstArticle = (
				<div key={article.Id}>
					<div className="w3-container w3-padding-large">
						<h2><b>{article.DisplayName}</b></h2>
					</div>
						<div className="w3-container w3-padding-large w3-bottombar">
							{/* <h2><b>{article.DisplayName}</b></h2> */}
							<i>{article.Description}</i>
							<p dangerouslySetInnerHTML={{ __html: article.Body }} />
							<div className="small">
								<Moment date={article.CreationDate} format="YYYY.MM.DD." />)
							</div>
						</div>
				</div>
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
)(GenericContent as any);
	