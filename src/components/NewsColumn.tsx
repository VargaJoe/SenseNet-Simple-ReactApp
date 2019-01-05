import * as React from 'react';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import Moment from 'react-moment';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';
import { Link } from 'react-router-dom';
const DATA = require('../config.json');

class CustomArticle extends Folder {
	PublishDate: Date;
}

interface Props {
	pathTo:  string;
	name: string;
	getColumnContent: any;
	repositoryUrl: string;
}

class NewsColumn extends React.Component<Props, any> {
	
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			colItems: {},
			ids: {}
		};
	}

	componentWillReceiveProps(nextProps: any) {	
		alert(nextProps.pathTo + '\r\n' + this.props.pathTo);	
		if (nextProps.pathTo !== this.props.pathTo) {
			this._initializeComponent();
		}						
	}	

	componentDidMount() {
		this._initializeComponent();
	}

	_initializeComponent() {
		let path = this.props.pathTo;
		// get the current user info
		let itemGet = this.props.getColumnContent(path, {
			select: ['Type', 'CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'Lead', 'OriginalAuthor', 'Author', 'PublishDate', 'Index', 'Actions'],
			expand: ['CreatedBy', 'Actions/SOxSOImg'],
			orderby: [['PublishDate', 'desc'], ['Index', 'desc'], 'DisplayName'],
		} as IODataParams<CustomArticle>);

		itemGet.then((result: any) => {
			console.log(result.value.entities.entities);
			this.setState({
				isDataFetched: true,
				colItems: result.value.entities.entities,
				ids: result.value.result
			});
		});

		itemGet.catch((err: any) => {
			console.log(err);
		});
	}

	public render() {
		if (!this.state.isDataFetched) {
            return null;
        }
        console.log(status);
        
        const colItems = this.state.colItems;
        const colIds = this.state.ids;

		const column = colIds
			.map((key: number) =>
			(   
				(colItems[key].Path.includes('/News/')) ? showNews(this.props.repositoryUrl, key, colItems[key]) : showReview(this.props.repositoryUrl, key, colItems[key])				
			)
		);

		return (
			<div className="w3-third">
				<h3>{this.props.name}</h3>
				<ul className="w3-ul w3-hoverable">
					{column}
				</ul>
			</div>
		);
	}
}

function getSitePath() {
	let envSitePath = process.env.REACT_APP_SITE_PATH; // 'Root/Sites/%sitename%'; 
	if (envSitePath) {
		var fullWPort = window.location.host.split(':');
		var full = fullWPort[0];
		// window.location.host is subdomain.domain.com
		var parts = full.split('.');
		// var type = parts[parts.length];
		var domain = parts[parts.length - 1];
		// var sub = parts[0];
		
		envSitePath = envSitePath.replace('%sitename%', domain);
		// alert(envSitePath);
	}

	return ( envSitePath || DATA.sitePath );
}

function getRemoteApiUrl(siteName: string) {
	let envApiUrl = process.env.REACT_APP_API_URL; // 'https://data.%sitename%.hu'; 
	
	if (envApiUrl) {
		envApiUrl = envApiUrl.replace('%sitename%', siteName);
	}
	
	return envApiUrl || DATA.apiUrl;
}

function showReview(repoUrl: any, key: any, article: any) {
	// awful and hopefully temporary workaround to get category name from path
	let sitePath = getSitePath();
	
	if (article.Path.startsWith(sitePath)) {
		let catName = article.Path.replace(sitePath + '/', '');
		catName = catName.substr(0, catName.indexOf('/'));
	
		return (
			<li key={key} className="w3-padding-16">		
				<Link className="no-score" to={'/' + catName + '/' + article.Name}>		
						<img src={repoUrl + article.Actions.find(function (obj: any) { return obj.Name === 'SOxSOImg'; }).Url} className="w3-left w3-margin-right news-img" />
						<span className="w3-large">{article.DisplayName}</span>
						<br/>
						<span className="hidden">{article.Description}</span>
						<span className="small hidden">{article.Author}</span>
						<span><Moment date={article.PublishDate} format="YYYY.MM.DD." /></span>
				</Link>
			</li>
		);
	} else {
		// custom action is required for sibling site url, for now an ugly workaround
		let siteName = article.Path.replace('/Root/Sites/', '');
		siteName = siteName.substr(0, siteName.indexOf('/'));
		let catName = article.Path.replace('/Root/Sites/' + siteName + '/', '');
		catName = catName.substr(0, catName.indexOf('/'));

		return (
			<li key={key} className="w3-padding-16">		
				<a className="no-score" href={'https://' + siteName + '.hu/' + catName + '/' + article.Name}>		
						<img src={getRemoteApiUrl(siteName) + '/' + article.Actions.find(function (obj: any) { return obj.Name === 'SOxSOImg'; }).Url} className="w3-left w3-margin-right news-img" />
						<span className="w3-large">{article.DisplayName}</span>
						<br/>
						<span className="hidden">{article.Description}</span>
						<span className="small hidden">{article.Author}</span>
						<span><Moment date={article.PublishDate} format="YYYY.MM.DD." /></span>
				</a>
			</li>
		);
	}	
	
}

function showNews(repoUrl: any, key: any, article: any) {
	// awful and hopefully temporary workaround to get category name from path
	let sitePath = getSitePath();
	let catName = article.Path.replace(sitePath + '/', '');
	catName = catName.substr(0, catName.indexOf('/'));

	return (
		<li key={key} className="w3-padding-16">
			<Link className="no-score"  to={'/News/' + article.Name}>
				<Moment date={article.PublishDate} format="YYYY.MM.DD. " />:
				{article.DisplayName}<br />
				<div className="small">{article.Lead}</div>
			</Link>
		</li>
	);
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
	};
};

// export default NewsColumn;
export default connect(
	mapStateToProps,
	(dispatch) => ({
		getColumnContent: (path: string, options: any) => dispatch(Actions.requestContent(path, options)),
	})
)(NewsColumn as any);
