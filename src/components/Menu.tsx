import * as React from 'react';
import { connect } from 'react-redux';
import { loadCategories } from '../reducers/categories';

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
    loadMenuItems: Function;   
    isMenuFetched: boolean; 
    menuItems: any;
}

class Menu extends React.Component<Props, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            menuTrigger: this.props.menuTrigger,
            menuItems: null,
            isDataFetched: false,
            components: []
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler = () => {
        this.props.openMenu();   
    }

    addComponent = async (type: string) => {
        let compoName = `${type}Item`;
        if (this.state.components.findIndex((c: any) => c.name === compoName) === -1) {
            console.log(`Loading ${compoName} component...`);
        
            import(`./leftmenu/${compoName}`)
            .then((component: any) => {
                this.setState({
                    components: (this.state.components.findIndex((c: any) => c.name === `${compoName}`) > -1) ? this.state.components : [...this.state.components, component.default]
                  });
            })
            .catch(error => {
                console.error(`"${compoName}" not yet supported: ${error}`);
            });
        }
    }

    public componentDidMount() {
        const menuPath = process.env.REACT_APP_MENU_PATH || DATA.menuPath;
        let menutType = process.env.REACT_APP_MENU_TYPE || DATA.menuType;

        let menuitems = this.props.loadMenuItems(menuPath, {
			select: ['Name', 'IconName', 'Id', 'Path', 'Index', 'DisplayName'],
			query: 'Type:' + menutType + ' AND Hidden:0 .AUTOFILTERS:OFF',
			orderby: ['Index', 'DisplayName']
		} as IODataParams<GenericContent>);

        menuitems.then((result: any) => {
            // Technical Debt: one type should be loaded once
            result.value.results.map(async (item: any) => {
                await this.addComponent(item.Type);
            });
        });

        menuitems.catch((err: any) => {
            console.log(err);
        });
    }

    public render() {
        if (!this.props.isMenuFetched) {
			return null;
        }
        
        const { components } = this.state;
        if (components.length === 0) {
            return <div>Loading...</div>;
        }
        
        const menuItems = this.props.menuItems;
        const menu = Object.keys(menuItems)
			.map((key: any) => {
                let Compo = this.state.components.find((DynCom: any)  => {
                return (DynCom.name === `${menuItems[key].Type}Item`);
                });

                if (Compo === undefined) {
                    return;
                }
                return (
                        <Compo key={key} name={menuItems[key].DisplayName} icon={fontImportantClass + menuItems[key].IconName} pathTo={'/' + menuItems[key].Name} />
                );
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
        isMenuFetched: state.site.categories.isDataFetched,
        menuItems: state.site.categories.categories,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		loadMenuItems: (path: string, options: any) => dispatch(loadCategories(path, options)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu as any);