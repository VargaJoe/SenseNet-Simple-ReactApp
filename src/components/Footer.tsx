import * as React from 'react';

class Footer extends React.Component<any, any> {
	public render() {
		return (
			<footer id="mangajanlo-footer">
				<div className="w3-black w3-center w3-padding-24">{'Powered by '}
				 	<a href="https://community.sensenet.com/" title="Sensenet API" target="_blank" className="w3-hover-opacity">sensenet</a>,{' '}
					<a href="https://reactjs.org/" title="React.js" target="_blank" className="w3-hover-opacity">react</a>{' and '}
					<a href="https://www.w3schools.com/w3css/default.asp" title="W3.CSS" target="_blank" className="w3-hover-opacity">w3.css</a>
				</div>
			</footer>
		);
	}
}

export default Footer;
