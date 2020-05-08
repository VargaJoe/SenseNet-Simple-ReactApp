import * as React 		from 'react';
import { connect } 		from 'react-redux';
import { loadArticle } 	from '../reducers/article';
import { Helmet } 		from 'react-helmet';
const DATA = require('../config.json');
let siteTitle = process.env.REACT_APP_SITE_TITLE || DATA.siteTitle;

const defaultComponent = 'LeisureArticle';
// const defaultComponent = 'GenericContent';
class Content extends React.Component<any, any> {
	img: HTMLImageElement | null;
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			article: {},
			components: [],
			defaultCompName: ''
		};
	}

	addComponent = async (type: string, setDef: boolean = false) => {
        let compoName = `${type}`;
        if (this.state.components.findIndex((c: any) => c.name === compoName) === -1) {
            console.log(`CONTENT: Loading ${compoName} component...`);
        
            await import(`./content/${compoName}`)
            .then((component: any) => {
				const loadedComp = component.default.WrappedComponent;
				console.log('CONTENT: component loaded:');
				console.log(component);

				let defaultCompName = this.state.defaultCompName;

				if (setDef) {
					console.log(`CONTENT: ${compoName} has been set as default component.`);
					defaultCompName = `${compoName}`;
				}

				console.log(`CONTENT: ${compoName} loaded! State should be updated. Newly loaded component:`);
				console.log(loadedComp);
				console.log('CONTENT: State will be saved now!');
                this.setState({
					components: (this.state.components.findIndex((c: any) => c.name === `${compoName}`) > -1) ? this.state.components : [...this.state.components, {name: compoName, compo: loadedComp}],
					defaultCompName: defaultCompName
				  });
				console.log('CONTENT: State is saved:');
				console.log(this.state);				
            })
            .catch(error => {
				console.error(`CONTENT: "${compoName}" not yet supported: ${error}`);
            });
        }
    }

	componentDidMount() {
		this.addComponent(defaultComponent, true);
		this._initializeComponent();
	}
	
	_initializeComponent() {
		let articleType = process.env.REACT_APP_ARTICLE_TYPE || DATA.articleType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;
		let categoryName = this.props.match.params.categoryName;
		let path = sitePath + '/' + categoryName;
		
		let articleName = this.props.match.params.articleName;
		this.props.loadArticleContent(path, {
			query: 'TypeIs%3A' + articleType + ' AND Name%3A\'' + articleName + '\'',
		}).then((result: any) => {
			console.log('CONTENT: Article is loaded. State will be saved now!');
			this.addComponent(result.value.Type)
			.then(() => {
				this.setState({
					isDataFetched: true,
					categoryName: categoryName,
					articleName: articleName
				});
			});
		}).catch((err: any) => {
			console.log(err);
		});
	}

	public render() {
		if (!this.state.isDataFetched) {
            return null;
        }

		let domain = process.env.REACT_APP_CANON_URL || DATA.siteUrl;
		let articleName = this.state.articleName;
		let articles = this.props.articles;
		if (articles === undefined || articles === []) {
			return null;
		}
		
		let article = articles.find(function (obj: any) { return obj.Name === articleName; });
        if (article === undefined) {
			return null;
		}

		// dynamic component by content type
		console.log(`CONTENT: search for component: ${article.Type}`);
		let CompoWrapper = this.state.components.find((DynCom: any)  => {
			return (DynCom.name === `${article.Type}`);
			});

		// fallback
		if (CompoWrapper === undefined) {
			console.log('CONTENT: fallback selected');
			CompoWrapper = this.state.components.find((DynCom: any)  => {
				return (DynCom.name === this.state.defaultCompName);
				});
			console.log('CONTENT: Default component should be retrieved from state:');
			console.log(this.state.components);
			console.log(CompoWrapper);
		} else {
			console.log('CONTENT: ' + CompoWrapper.name + ' selected');
		}

		if (CompoWrapper === undefined) {
			console.log('CONTENT: Masaka! Dynamic component not found. Not even default component!?');
			return ( 
				<div />				
			);
		} 
		let Compo = CompoWrapper.compo;

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
				<Compo key={article.Id} 
					categoryName={this.props.match.params.categoryName} 
					articleName={this.props.match.params.articleName} 
					{...this.props} />
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
	