import * as React				            from 'react';
import { connect }                          from 'react-redux';
import { Link } 					        from 'react-router-dom';

class TestUserRoute extends React.Component<any, any> {

    public render() {

        console.log(this.props);

		return (
			<div>
				test user with routing
                <br/>
                {this.props.userName}
                <br/>
                <br/>
                <Link to="/" >
                    Back Home
                </Link>
			</div>
		);
	}
}

const mapStateToProps = (state: any, match: any) => {
    return {
        userName :      state.sensenet.session.user.userName,
    };
};

export default connect(
    mapStateToProps,
)(TestUserRoute as any);
 