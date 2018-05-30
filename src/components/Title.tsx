import * as React				from 'react';

class Title extends React.Component<any, any> {

	public render () {
		return (
			<h2 className="sn_title">
				{this.props.name}
			</h2>
		);
	}
}

export default Title;
