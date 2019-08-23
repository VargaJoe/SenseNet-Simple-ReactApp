import * as React				 			from 'react';

interface Props {
	pathTo:  string;
	name: string;
	icon: string;
}

class LinkItem extends React.Component<Props, {}> {
	
	constructor(props: any) {
		super(props);
		
		this.handleClick = this.handleClick.bind(this);
	}

	public handleClick () { 
		console.log( this.props.name);
	}

	public render() {
		return (
			<a href={this.props.pathTo} className="a w3-bar-item w3-button w3-padding w3-text-teal" >
					<i className={'fa ' + this.props.icon + ' fa-fw w3-margin-right'} />
					{this.props.name.toUpperCase()}
			</a>
		);
	}
}

export default LinkItem;
