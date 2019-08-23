import {
    Actions
} from '@sensenet/redux';
import * as React from 'react';
import { connect } from 'react-redux';
import MenuItem from './MenuItem';
import LinkItem from './LinkItem';

import { IODataParams } from '@sensenet/client-core';
import { GenericContent } from '@sensenet/default-content-types';
import Logo 				from './Logo';

const DATA = require('../config.json');
const fontImportantClass = ' fi ';
// const logo = require('../images/logo.png');

interface Props {
    menuTrigger: string;
    getMenuItems: any;
    openMenu: Function;
    repositoryUrl: string;    
}

class Menu extends React.Component<Props, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            menuTrigger: this.props.menuTrigger,
            menuItems: null,
            isDataFetched: false
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler = () => {
        this.props.openMenu();   
    }
    
    public componentDidMount() {
        const menuPath = process.env.REACT_APP_MENU_PATH || DATA.menuPath;
        const sitePath = process.env.REACT_APP_SITE || DATA.sitePath;
        let menutType = process.env.REACT_APP_MENU_TYPE || DATA.menuType;

        let menuitems = this.props.getMenuItems(menuPath, {
            select: ['Name', 'IconName', 'Id', 'Path', 'Index', 'DisplayName', 'Type', 'Actions'],
            expand: ['Actions'],
			query: 'InFolder:"' + sitePath + '" AND Type:' + menutType + ' AND Hidden:0 .AUTOFILTERS:OFF',
			orderby: ['Index', 'DisplayName']
		} as IODataParams<GenericContent>);

        menuitems.then((result: any) => {
            console.log(result.value.entities.entities);
            this.setState({
                isDataFetched: true,
                menuItems: result.value.entities.entities,
                ids: result.value.result
            });
        });

        menuitems.catch((err: any) => {
            console.log(err);
        });
    }

    public render() {
        if (!this.state.isDataFetched) {
            return null;
        }
        console.log(status);
        
        const menuItems = this.state.menuItems;
        const menuIds = this.state.ids;

        const menu = menuIds
			.map((key: number) => {
                let itemType = menuItems[key].Type;
                // console.log(itemType);
                switch (itemType) {
                    case 'SoftLink': {
                        let browseAction = menuItems[key].Actions.find(function (obj: any) { return obj.Name === 'Browse'; });
                        let browseUrl = '';
                        if (browseAction !== undefined) {
                            browseUrl = browseAction.Url;                            
                        }		
                        return (
                            <LinkItem key={key} name={menuItems[key].DisplayName} icon={fontImportantClass + this.state.menuItems[key].IconName} pathTo={browseUrl} />
                        );
                    }
                    default: return (                
                        <MenuItem key={key} name={menuItems[key].DisplayName} icon={fontImportantClass + this.state.menuItems[key].IconName} pathTo={'/' + menuItems[key].Name} />
                    );
                }
            }
        );
        
        return (
            <nav className={'w3-sidebar w3-white w3-animate-left ' + this.props.menuTrigger} id="mySidebar"><br/>
                
                <div className="w3-container">
                    <span className="w3-button w3-hide-large w3-xxlarge w3-hover-text-grey" onClick={this.clickHandler} title="close menu">
                        <i className="fa fa-times" />
                    </span>
                   <Logo/>
                   <br /><br />
                </div>
                
                <div className="w3-bar-block">
                {menu}
                </div>
                <div className="w3-panel w3-large">
                    <a href={'mailto:' + (process.env.REACT_APP_SITE_EMAIL || DATA.siteEmail)}>
                        <i className="fa fa-envelope w3-hover-opacity"  />
                    </a>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
	};
};

export default connect(
    mapStateToProps,
    (dispatch) => ({
        getMenuItems: (path: string, options: any) => dispatch(Actions.requestContent(path, options)),
    })
)(Menu as any);