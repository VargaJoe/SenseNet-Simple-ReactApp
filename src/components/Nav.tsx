import Home from './Home';
import Content from './Content';
import Category from './Category';
import Translateds from './Translateds';
import NoMatch from './NoMatch';

const Data = {
	public: [
		{
			exact: true,
			path: '/:categoryName/:articleName',
			component: Content
		},
		{
			exact: true,
			path: '/Fordítások',
			component: Translateds
		},
		{
			exact: true,
			path: '/:categoryName',
			component: Category
		},
		{
			exact: true,
			path: '/',
			component: Home
		},
		{
			component: NoMatch
		}
	]
};

export default Data;