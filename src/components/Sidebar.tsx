import * as React			from 'react';
import Menu 				from './Menu';

interface Props {
	menuTrigger: string;
}

class Sidebar extends React.Component<Props, {}> {
	
	public render () {
		
		return (
				<Menu menuTrigger={this.props.menuTrigger} />
		);
	}
}

export default Sidebar;
