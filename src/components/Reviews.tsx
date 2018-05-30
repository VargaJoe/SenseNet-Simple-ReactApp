import * as React				            from 'react';
import Moment from 'react-moment';
// import { PathHelper }                       from '@sensenet/client-utils';
import { connect }                          from 'react-redux';
import { Actions }                			from '@sensenet/redux';
import {
	withRouter
}                                           from 'react-router-dom';
import { Link } 					        from 'react-router-dom';
import { Folder } from '@sensenet/default-content-types';
import { IODataParams } from '@sensenet/client-core';

const DATA = require('../config.json');

class LeisureArticle extends Folder {
	PublishDate: Date;
}

class Reviews extends React.Component<any, any> {
    constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: {},
			ids: {}
		};
    }
    
    componentDidMount  () {
		// let path = PathHelper.joinPaths(DATA.home);
		let path = DATA.home;
		// get the current user info
		// let userGet = this.props.getHomeContent(path, {
		// 	select : ['Publisher', 'Author', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate'],
		// 	filter : 'isof(\'LeisureArticle\')',
		// 	orderby : ['PublishDate', 'desc']
		// } as IODataParams<LeisureArticle>);
		
		let userGet = this.props.getHomeContent(path, {
			select : ['Publisher', 'Author', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate'],
			query : 'TypeIs:LeisureArticle AND InTree:\'' + path + '\'',
			orderby : [['PublishDate', 'desc'], , 'DisplayName']
		} as IODataParams<LeisureArticle>);

		userGet.then( (result: any) => {
			console.log(result.value.entities.entities);
				this.setState({ 
					isDataFetched : true,
					articles: result.value.entities.entities,
					ids: result.value.result
				});
		});

		userGet.catch((err: any) => {
			console.log(err);
		});
    }
    
    public render() {

		if ( !this.state.isDataFetched ) {
			return null;
		}
		
		let homePageItems = this.state.articles;
		let homePageIds = this.state.ids;
		const homePage = homePageIds
			.map( (key: number) => 
		    (
		        <Link key={key} to={'/Article/' + homePageItems[key].Name}>
		            <h2>{homePageItems[key].DisplayName}</h2>
					<div className="article__info">
						<small className="sn_blue">{homePageItems[key].Author} </small>
						<small>({homePageItems[key].Publisher + ', '} 
							<Moment format="YYYY.MM.DD.">
								{homePageItems[key].PublishDate}
            				</Moment>
						)
						</small>
					</div>
		            <p>{homePageItems[key].Description}</p>
					<hr/>
		        </Link>

		    )
		);

		return (
			<div>
				<h1>Home Page</h1>
                {homePage}
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName :              state.sensenet.session.user.userName,
	};
};

export default withRouter(connect(
	mapStateToProps,
	(dispatch) => ({
		getHomeContent: (path: string, options: any) => dispatch(Actions.requestContent<LeisureArticle>( path, options )),
	})
)(Reviews as any));
 