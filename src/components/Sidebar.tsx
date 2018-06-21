import * as React			from 'react';
import Menu 				from './Menu';

interface Props {
	menuTrigger: string;
	openMenu: Function;
}

class Sidebar extends React.Component<Props, {}> {
	
	public render () {
		
		return (
				<Menu openMenu={this.props.openMenu} menuTrigger={this.props.menuTrigger} />
		);
	}
}

export default Sidebar;
