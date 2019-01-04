import Home from './Home';
import Article from './Article';
import Category from './Category';
import NoMatch from './NoMatch';

const Data  = {
  public : [
				{
									exact: true,
									path: '/:categoryName/:articleName',
									component: Article
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