import Home from './Home';
import Article from './Article';
// import Reviews from './Reviews';
// import ReviewsBio from './ReviewsBio';
// import ReviewsAnime from './ReviewsAnime';
// import ReviewsKJK from './ReviewsKJK';
// import ReviewsOther from './ReviewsOther';
import Category from './Category';
import Missing from './Missing';

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
									component: Missing
				}
      ]
};

export default Data;