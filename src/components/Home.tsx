import * as React				            from 'react';
import { PathHelper }                       from '@sensenet/client-utils';
import { connect }                          from 'react-redux';
import { Actions }                			from '@sensenet/redux';
import {
	withRouter
}                                           from 'react-router-dom';
import { Link } 					        from 'react-router-dom';

const DATA = require('../config.json');

const Timestamp = require('react-timestamp');

class Home extends React.Component<any, any> {
    constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			articles: {}
		};
    }
    
    componentDidMount  () {
		let path = PathHelper.joinPaths(DATA.home);
		// get the current user info
		let userGet = this.props.getHomeContent(path, {
			select : ['CreationDate', 'CreatedBy', 'Description', 'DisplayName', 'Id', 'OriginalAuthor', 'Author', 'PublishDate'],
			expand : ['CreatedBy'],
			query: 'TypeIs:LeisureArticle .TOP:5 .REVERSESORT:PublishDate', 
		});
		
		userGet.then( (result: any) => {
			console.log(result.value.entities.entities);
				this.setState({ 
					isDataFetched : true,
					articles: result.value.entities.entities
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
		const homePage = Object.keys(homePageItems).map( (key: any) => 
		    (
		        <Link key={key} to={'/Article/' + homePageItems[key].Name}>
		            <h2>{homePageItems[key].DisplayName}</h2>
					<div className="article__info">
						<small className="sn_blue">{homePageItems[key].CreatedBy.Name}</small>
						<small>
							<Timestamp time={homePageItems[key].CreationDate} utc={false} format="full" />
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
		getHomeContent:    (path: string, options: any) => dispatch(Actions.requestContent( path, options )),
	})
)(Home as any));
 