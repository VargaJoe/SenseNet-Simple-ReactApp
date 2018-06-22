import {
    Actions
} from '@sensenet/redux';
import * as React from 'react';
import { connect } from 'react-redux';
import MenuItem from './MenuItem';
import { Link } from 'react-router-dom';
import { IODataParams } from '@sensenet/client-core';
import { GenericContent } from '@sensenet/default-content-types';

const DATA = require('../config.json');
const fontImportantClass = ' fi ';
const logo = require('../images/logo.png');

interface Props {
    menuTrigger: string;
    getMenuItems: any;
    openMenu: Function;
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
        const path = DATA.menu;
        // const options = {
        //     select: ['Name', 'IconName', 'Id', 'Path', 'Index', 'DisplayName'],
        //     query: 'Type:GenericContent AND Hidden:0 .AUTOFILTERS:OFF'            
        // } as IODataParams<IContent>;
        // const users = this.props.getMenuItems(path, options);

        let menuitems = this.props.getMenuItems(path, {
			select: ['Name', 'IconName', 'Id', 'Path', 'Index', 'DisplayName'],
			query: 'Type:MenuItem AND Hidden:0 .AUTOFILTERS:OFF',
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

        // const menu = Object.keys(menuItems).map((key: any) =>
        const menu = menuIds
			.map((key: number) =>
            (
                <MenuItem key={key} name={menuItems[key].DisplayName} icon={fontImportantClass + this.state.menuItems[key].IconName} pathTo={'/' + menuItems[key].Name} />
            )
        );
        return (
            <nav className={'w3-sidebar w3-white w3-animate-left ' + this.props.menuTrigger} id="mySidebar"><br/>
                
                <div className="w3-container">
                    <span className="w3-button w3-hide-large w3-xxlarge w3-hover-text-grey" onClick={this.clickHandler} title="close menu">
                        <i className="fa fa-times" />
                    </span>
                    <Link to={'/'}>
                    <img src={logo} alt="mangajánló" className="w3-round side-logo" />                    
                    <br /><br />
                    {/* <h4><b>MangAjánló</b></h4> */}
                    {/* <p className="w3-text-grey hidden">Template by W3.CSS</p> */}
                    </Link>
                </div>
                
                <div className="w3-bar-block">
                {menu}
                </div>
                <div className="w3-panel w3-large">
                    <a href={'mailto:' + process.env.REACT_APP_SERVICE_URL}>
                        <i className="fa fa-envelope w3-hover-opacity"  />
                    </a>
                </div>
            </nav>
        );
    }
}

// export default Menu;

const mapStateToProps = (state: any, match: any) => {
    return {
        
    };
};

export default connect(
    mapStateToProps,
    (dispatch) => ({
        getMenuItems: (path: string, options: any) => dispatch(Actions.requestContent(path, options)),
    })
)(Menu as any);