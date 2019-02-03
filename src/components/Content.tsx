import * as React 		from 'react';
import { connect } 		from 'react-redux';
import { loadArticle } 	from '../reducers/article';

const DATA = require('../config.json');

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
            })
            .catch(error => {
				console.error(`"${compoName}" not yet supported: ${error}`);
            });
        }
    }

	componentDidMount() {
		this.addComponent('LeisureArticle');
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
			Compo = this.state.components.find((DynCom: any)  => {
				return (DynCom.name === 'LeisureArticle');
				});
		}

		if (Compo === undefined) {
			return ( 
				<div />
			);
		}

		return (
				<Compo key={article.Id} article={article} repositoryUrl={this.props.repositoryUrl} />
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
	