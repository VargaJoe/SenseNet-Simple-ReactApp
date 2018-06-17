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

class Intro extends React.Component<any, any> {
	public render() {
		return (
			<div className="w3-container w3-bottombar">	
				 Az oldal létrejöttének célja kettős. Egyrészt teret enged irományaimnak, ami által bepillantást 
				 enged főként a mangák, alkotóik, részben pedig egyéb könyvek és sorozatok világába. A másik ok 
				 személyes, segít felfedezni a React appok rejtelmeit. Utóbbi ok miatt lehet, hogy nem túl 
				 zökkenőmentes az oldal működése, ezért előre elnézést kívánok.<br/>
				 Kellemes időtöltést kívánok az ide tévedőknek.
				<div className="small">
					PlasticE (2018.)
				</div>	
			</div>
		);
	}
}

export default Intro;
