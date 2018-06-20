import * as React				 			from 'react';
import { Link } 					        from 'react-router-dom';

interface Props {
	pathTo:  string;
	name: string;
	icon: string;
}

class MenuItem extends React.Component<Props, {}> {
	
	constructor(props: any) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
	}

	public handleClick () { 
		console.log( this.props.name);
	}

	public render() {
		return (
			<Link to={this.props.pathTo} className="w3-bar-item w3-button w3-padding w3-text-teal" onClick={this.handleClick}>
					<i className={this.props.icon} />
					{/* <i class="fa fa-th-large fa-fw w3-margin-right"/> */}			
					{this.props.name}
			</Link>
		);
	}
}

export default MenuItem;
