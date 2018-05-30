import { LoginState }                       from '@sensenet/client-core';
import { Actions
}                                           from '@sensenet/redux';
import * as React				            from 'react';
import { connect }                          from 'react-redux';
import MenuItem 				            from './MenuItem';

const DATA = require('../config.json');
const fontImportantClass = ' fi ';

class Menu extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			menuItems: null,
			isDataFetched: false
		};
	}

	public componentDidMount  () {
        const path = DATA.menu;
        const  options = {
            select : ['Name', 'IconName', 'Id', 'Path', 'DisplayName'], 
            query: 'Type:Folder AND Hidden:0 AND InFolder:\'' + path + '\''
        };
        const users = this.props.getMenuItems(path, options);

        users.then( (result: any) => {
            console.log(result.value.entities.entities);
            this.setState({
                isDataFetched : true,
                menuItems: result.value.entities.entities
            });
        });

        users.catch((err: any) => {
            console.log(err);
        });
    }

	public render () {
		if ( !this.state.isDataFetched ) {
            return null;
		}
        const status = this.props.userLoginState !== LoginState.Authenticated;
        console.log(status);
        const menuItems = this.state.menuItems;
        const menu = Object.keys(menuItems).map( (key: any) => 
            (
                <MenuItem key={key} name={menuItems[key].DisplayName} icon={fontImportantClass + this.state.menuItems[key].IconName} pathTo={'/' + menuItems[key].Name}/>
            )
        );
		return (
			<div className="sn_sidebar__menu">
                {/* <div> */}
                    {/* <MenuItem name={'Main Layput 1'} icon={fontImportantClass + 'flaticon-group-of-businessmen'} pathTo="/main_layout_1"/>
                    <MenuItem name={'Main Layput 2'} icon={fontImportantClass + 'flaticon-hierarchy-levels'} pathTo="/main_layout_2"/>
                    <MenuItem name={'Main Layput 3'} icon={fontImportantClass + 'flaticon-signal-1'} pathTo="/main_layout_3"/> */}
                    {/* {status ? '' : menu} */}
                    {menu}
                    {/* <MenuItem name={'404'} icon={fontImportantClass + 'fi flaticon-family-tree'} pathTo="/404"/> */}
                    {/* <MenuItem name={'Login'} icon={fontImportantClass + 'fi flaticon-family-tree'} pathTo="/login"/> */}
                {/* </div> */}
			</div>
		);
	}
}

// export default Menu;

const mapStateToProps = (state: any, match: any) => {
    return {
        userLoginState: 		state.sensenet.session.loginState, // state.user.user.FullName,
    };
};

export default connect(
    mapStateToProps,
    (dispatch) => ({
        getMenuItems:    (path: string, options: any) => dispatch(Actions.requestContent( path, options )),
    })
)(Menu as any);