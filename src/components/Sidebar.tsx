import * as React			from 'react';
import Logo 				from './Logo';
import Menu 				from './Menu';
import SidebarUser 				from './SidebarUser';

class Sidebar extends React.Component<any, {}> {
	
	public render () {
		
		return (
			<div className="sn_sidebar">
				<Logo openMenu={this.props.openMenu} />
				<SidebarUser/>
				<Menu />
			</div>
		);
	}
}

export default Sidebar;
