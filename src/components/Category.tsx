import * as React 		from 'react';
import { connect } 		from 'react-redux';
import { loadCategory } from '../reducers/category';
import { loadArticles } from '../reducers/articles';
import {
	withRouter
} 						from 'react-router-dom';
import { 
	GenericContent, 
 } 			from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';
import { Helmet } 		from 'react-helmet';

const DATA = require('../config.json');
let siteTitle = process.env.REACT_APP_SITE_TITLE || DATA.siteTitle;

const defaultComponent = 'Folder';
class Category extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			category: {},
			isDataFetched: false,
			components: [],
			categoryName: ''
		};
	}

	addComponent = async (type: string, setDef: boolean = false) => {
        let compoName = `${type}`;
        if (this.state.components.findIndex((c: any) => c.name === compoName) === -1) {
            console.log(`CATEGORY: Loading ${compoName} component...`);
        
            await import(`./list/${compoName}`)
            .then((component: any) => {
				const loadedComp = component.default.WrappedComponent;
				console.log('CATEGORY: component loaded:');
				console.log(component);

				let defaultCompName = this.state.defaultCompName;

				if (setDef) {
					console.log(`CATEGORY: ${compoName} has been set as default component.`);
					defaultCompName = `${compoName}`;
				}

				console.log(`CATEGORY: ${compoName} loaded! State should be updated. Newly loaded component:`);
				console.log(loadedComp);
				console.log('CATEGORY: State will be saved now!');
                this.setState({
					components: (this.state.components.findIndex((c: any) => c.name === `${compoName}`) > -1) ? this.state.components : [...this.state.components, {name: compoName, compo: loadedComp}],
					defaultCompName: defaultCompName
				  });
				console.log('CATEGORY: State is saved:');
				console.log(this.state);				
            })
            .catch(error => {
				console.error(`CATEGORY: "${compoName}" not yet supported: ${error}`);
				this.addComponent(defaultComponent, true);
            });
        }
    }

	componentWillReceiveProps(nextProps: any) {		
		if (nextProps.match.params.categoryName !== this.props.match.params.categoryName) {
			this._initializeComponent(nextProps.match.params.categoryName);
		}						
	}	

	componentDidMount() {
		// this.addComponent(defaultComponent, true);
		this._initializeComponent(this.props.match.params.categoryName);
	}
	
	_initializeComponent(categoryName: string) {
		let menutType = process.env.REACT_APP_MENU_TYPE || DATA.menuType;
		let sitePath = process.env.REACT_APP_SITE || DATA.site;		
		let path = sitePath + '/' + categoryName;

		this.setState({
				categoryName: categoryName,
		});

		let category = this.props.categories.find((obj: any) => obj.Name === categoryName );
		console.log('CATEGORY: initialze');
		console.log(this.props.categories);

		if (category === undefined) {
			console.log('CATEGORY: load category');
			let categoryGet = this.props.loadCategoryContent(path, {
				query: 'Type%3A' + menutType + ' AND Hidden%3A0 .AUTOFILTERS%3AOFF',
				orderby: ['Index', 'DisplayName']
			} as IODataParams<GenericContent>);

			categoryGet.then((catResult: any) => {			
				console.log('CATEGORY: category loaded');
				category = catResult.value;
				this.addComponent(category.Type)
				.then(() => {
					this.setState({
						isDataFetched: true,
						category: category
					});
				});
			}).catch((err: any) => {
				console.log(err);
			});
		} else {
			console.log('CATEGORY: category already loaded, set state');
			this.setState({
				isDataFetched: true,
				category: category
			});
		}
	}

	public render() {
		if (!this.state.isDataFetched) {
            return null;
        }
		
		let domain = process.env.REACT_APP_CANON_URL || DATA.siteUrl;	
		console.log(domain);

		let categoryName = this.state.categoryName;
		let categories = this.props.categories;
		let category = categories.find(function (obj: any) { return obj.Name === categoryName; });

		console.log('CATEGORY: render');
		console.log(this.props.categories);

		// if category can not identified at this point it's a dealbreaker
		if (category === undefined) {
			return null;
		}
		
		// *************************** start of dynamic content ***************************  //
		// dynamic component by content type
		console.log(`CATEGORY: search for component: ${category.Type}`);
		let CompoWrapper = this.state.components.find((DynCom: any)  => {
			return (DynCom.name === `${category.Type}`);
			});

		// fallback
		if (CompoWrapper === undefined) {
			console.log('CATEGORY: fallback selected');
			CompoWrapper = this.state.components.find((DynCom: any)  => {
				return (DynCom.name === this.state.defaultCompName);
				});
			console.log('CATEGORY: Default component should be retrieved from state:');
			console.log(this.state.components);
			console.log(CompoWrapper);
		} else {
			console.log('CATEGORY: ' + CompoWrapper.name + ' selected');
		}

		if (CompoWrapper === undefined) {
			console.log('CATEGORY: Masaka! Dynamic component not found. Not even default component!?');
			return ( 
				<div />				
			);
		} 
		let Compo = CompoWrapper.compo;
		// *************************** end of dynamic content ***************************  //

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
					<Compo key={category.Id}
					category={category}
					{...this.props} />
				</div>				
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	const siteArticles = state.site.articles;
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
		categories: state.site.categories.categories,
		articles: siteArticles.articles,
		loadedTags: siteArticles.loadedTags,
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
)(Category as any));
