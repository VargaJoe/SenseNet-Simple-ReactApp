import * as React 		from 'react';
import { connect } 		from 'react-redux';
import { loadArticle } 	from '../reducers/article';
import { Helmet } 		from 'react-helmet';
const DATA = require('../config.json');
let siteTitle = process.env.REACT_APP_SITE_TITLE || DATA.siteTitle;

const defaultComponent = 'LeisureArticle';
class Content extends React.Component<any, any> {
	img: HTMLImageElement | null;
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			article: {},
			components: [],
		};
	}

	addDefaultImageUrl(ev: any) {
		// ev.target.src = defaultImage;
		ev.target.className = 'hidden';
	}

	addComponent = async (type: string) => {
        let compoName = `${type}`;
        if (this.state.components.findIndex((c: any) => c.name === compoName) === -1) {
            console.log(`Loading ${compoName} component...`);
        
            import(`./content/${compoName}`)
            .then((component: any) => {
                this.setState({
                    components: (this.state.components.findIndex((c: any) => c.name === `${compoName}`) > -1) ? this.state.components : [...this.state.components, component.default.WrappedComponent]
				  });
				console.log(`${compoName} loaded! State should be updated:`);
				console.log(this.state.components);
            })
            .catch(error => {
				console.error(`"${compoName}" not yet supported: ${error}`);
            });
        }
    }

	componentDidMount() {
		this.addComponent(defaultComponent);
		console.log('Default component should be loaded in state:');
		console.log(this.state.components);
		this._initializeComponent();
	}
	
	_initializeComponent() {
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;
		let categoryName = this.props.match.params.categoryName;
		let path = sitePath + '/' + categoryName;

		let articleName = this.props.match.params.articleName;
		this.setState({
			categoryName: categoryName,
			articleName: articleName
		});

		let article = this.props.articles.find((obj: any) => obj.Name === articleName );

		// first load category if not presented, then use category path for intree parameter 
		// instead article type, so it can load any type of content or category send type info
		// OR only load category if not present with query info + content type AND load dynamically
		// component according to content type AND sub component will load its own "article" content
		if (article === undefined) {
			this.props.loadArticleContent(path, {
				select: ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'Publisher', 'PublishDate', 'Lead', 'Body', 'RelatedContent', 'Translation', 'Actions'],
				expand: ['CreatedBy', 'Translation', 'RelatedContent', 'Actions'],
				query: 'TypeIs:' + articleType + ' AND Name:\'' + articleName + '\'',
			}).then((result: any) => {
				this.setState({
					isDataFetched: true,
				});
				this.addComponent(result.value.Type);
			}).catch((err: any) => {
				console.log(err);
			});
		} else {
			this.addComponent(article.Type);
		}
	}

	public render() {
		let domain = process.env.REACT_APP_CANON_URL || DATA.siteUrl;

		let articles = this.props.articles;
		if (articles === undefined || articles === []) {
			return null;
		}
		let articleName = this.state.articleName;
		let article = articles.find(function (obj: any) { return obj.Name === articleName; });
        if (article === undefined) {
			return null;
		}

		// dynamic component by content type
		let Compo = this.state.components.find((DynCom: any)  => {
			return (DynCom.name === `${article.Type}`);
			});

		// fallback
		if (Compo === undefined) {
			console.log('fallback selevted');
			Compo = this.state.components.find((DynCom: any)  => {
				return (DynCom.name === defaultComponent);
				});
			console.log('Default component should be retrieved from state:');
			console.log(this.state.components);
			console.log(Compo);
		} else {
			console.log(Compo.name + ' selevted');
		}

		if (Compo === undefined) {
			console.log('Masaka! Dynamic component not found. Not even default component!?');
			return ( 
				<div />				
			);
		}

		return (
			<div>
				<Helmet>
					<meta charSet="utf-8" />
					<title>{siteTitle} - {article.DisplayName}</title>
					{/* concat title from site name + article name */}
					<link rel="canonical" href={`${domain}/${this.state.categoryName}/${this.state.articleName}`} />
					{/* concat url from article domain + article category + article name */}
					{/* ${window.location.host}/${this.state.categoryName}/${this.state.articleName} */}
				</Helmet>
				<Compo key={article.Id} article={article} repositoryUrl={this.props.repositoryUrl} />
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
		articles: state.site.articles.articles,
		state: state,
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
)(Content as any);
	