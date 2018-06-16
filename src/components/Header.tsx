import * as React from 'react';
// import { Route } from 'react-router-dom';

// const AllButton = () => (
// 	<Route render={({ history}) => (
// 	  <button
// 		type="button"
// 		className="w3-button w3-black"
// 		onClick={() => { history.push('/Ismertetők'); }}
// 	  >
// 		Összes
// 	  </button>
// 	)} />
//   );

class Header extends React.Component<any, any> {
	public render() {
		return (
			<header id="portfolio">
				{/* <a href="#"><img src="/w3images/avatar_g2.jpg" className="w3-circle w3-right w3-margin w3-hide-large w3-hover-opacity" /></a> */}
				<span className="w3-button w3-hide-large w3-xxlarge w3-hover-text-grey" ><i className="fa fa-bars" /></span>
				<div className="w3-container w3-bottombar">
					<h1><b>PlasticE manga ismertetői... és miegymás</b></h1>
					{/* <div className="w3-section w3-bottombar w3-padding-16">
						<span className="w3-margin-right">Filter:</span>
						<AllButton/>
						<button className="w3-button w3-white" disabled={true}><i className="fa fa-diamond w3-margin-right" />Manga</button>
						<button className="w3-button w3-white w3-hide-small" disabled={true}><i className="fa fa-photo w3-margin-right" />Anime</button>
						<button className="w3-button w3-white w3-hide-small" disabled={true}><i className="fa fa-map-pin w3-margin-right" />Other</button>
					</div> */}
				</div>
			</header>

		);
	}
}

export default Header;
