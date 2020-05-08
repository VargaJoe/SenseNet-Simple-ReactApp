import * as React from 'react';
import { connect } from 'react-redux';

class FolderContent extends React.Component<any, any> {
	img: HTMLImageElement | null;
	constructor(props: any) {
		super(props);
		this.state = {
			article: {},
			isDataFetched: false,
		};
	}
    public render() {

		return (
			<div>
				<h1>Folder</h1>
				
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
	return {
		userName: state.sensenet.session.user.userName,
		repositoryUrl: state.sensenet.session.repository.repositoryUrl,
		articles: state.site.articles.articles,
		state: state
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		
    };
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FolderContent as any);