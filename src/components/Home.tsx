import * as React from 'react';
import { connect } from 'react-redux';
import { Actions } from '@sensenet/redux';
import {
	withRouter
} from 'react-router-dom';

import NewsColumn from './NewsColumn';
import Intro from './Intro';
import { IODataParams } from '@sensenet/client-core';
import { GenericContent } from '@sensenet/default-content-types';

// const DATA = require('../config.json');
// import Moment from 'react-moment';
class Home extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			isDataFetched: false,
			columns: {},
			ids: {}		
		};
	}

	public componentDidMount() {
        const colPath = '/'; // process.env.REACT_APP_COL_PATH || DATA.menuPath;
        let colType = 'SmartFolder'; // process.env.REACT_APP_COL_TYPE || DATA.menuType;

        let columns = this.props.getHomeContent(colPath, {
			select: ['Name', 'Id', 'Path', 'Index', 'DisplayName'],
			query: 'Type:' + colType + ' AND Hidden:0 .AUTOFILTERS:OFF',
			orderby: ['Index', 'DisplayName']
		} as IODataParams<GenericContent>);

        columns.then((result: any) => {
            console.log(result.value.entities.entities);
            this.setState({
                isDataFetched: true,
				columns: result.value.entities.entities,
				ids: result.value.result
            });
        });

        columns.catch((err: any) => {
            console.log(err);
        });
    }

	public render() {
		if (!this.state.isDataFetched) {
            return null;
        }
		console.log(status);
		
		const columns = this.state.columns;
		const colIds = this.state.ids;

        // const menu = Object.keys(menuItems).map((key: any) =>
        const colDOM = colIds
			.map((key: number) =>
            (      
				<div>
				{/* {columns[key].Name} */}
				{/* <NewsColumn key={key} name={columns[key].DisplayName} pathTo={'/' + columns[key].Name} /> */}
				<NewsColumn name={columns[key].DisplayName} pathTo={'/' + columns[key].Name}  />
				</div>
            )
        );

		return (
			<div>
			<Intro />
			<div className="w3-row-padding">
				<div className="w3-container w3-padding-large">
					{colDOM}
				</div>
			</div>
		</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
	};
};

export default withRouter(connect(
	mapStateToProps,
	(dispatch) => ({
		getHomeContent: (path: string, options: any) => dispatch(Actions.requestContent(path, options)),
	})
)(Home as any));