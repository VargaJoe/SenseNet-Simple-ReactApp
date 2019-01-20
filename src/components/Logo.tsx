import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const DATA = require('../config.json');
const defaultImage = require('../images/logo.png');

class Logo extends React.Component<any, any> {
	public render() {
		let logoPath = process.env.REACT_APP_LOGO_PATH || DATA.siteLogo;
		let logoUrl = this.props.repositoryUrl + logoPath;
		if (logoPath === undefined || logoUrl === this.props.repositoryUrl) {
			logoUrl = defaultImage;
		}
		
		return (
			<Link to={'/'}>
				<img src={logoUrl} alt="site title" className="w3-round side-logo" />
			</Link>
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
    mapStateToProps    
)(Logo as any);
