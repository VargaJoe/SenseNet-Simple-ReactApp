# SenseNet Simple ReactApp

It is my first react application to test sensenet api feature. This simple app can connect to a sensenet repository, show cartegories on a menu, list articles of selected category and show article. Show queries defined by smartfolders in sensenet repository.

From environment variable it can manage multiple sites.
It works with a fixed skin.
There is no user handling and login.

# Prerequisites

- you have to have a sensenet repository
- your repository has to be reachable by your app as visitor 
- you create categories in your repository with the type you set in the config (all items with this type will show on the menu)
- you create your "articles" under the categories 
- category/menu items has these fields: 
- article type has these fields: Lead, Body, Author, Publisher, PublishDate and a sensenet actions called as Cover, HxHImg and SOxSOImg to show images (these can be created easily with ImgResizeApplication)
- you have to put your site logo as "logo.png" in sensenet repoitory under your site, eg /Root/Sites/yoursite/(structure)/Site/logo.png

# How to test

- Download the package to a folder
- set the config according your sensenet repository
- npm install
- npm start

The app will query "menuType" items from sensenet repository under and show them on the left sidebar. Main content area will show predefined text and query column items from the repository. These column containers can be for example SmartFolders with predefined queries to who latest items from categories. Navigate in the menu will show category view and list article items from under selected category. Navigate in a selected article will show the article view.

# Config

	apiUrl : give your sensenet site url here
	articleType :	this is the content type of your Content to show as "article"
	menuPath : 	relative path of the container Content of menu items (aka Category)
	menuType :	content type of menu items
	newsColPath : relative path of the container content of columns 
	newsColType : content type of column items containers	
	siteEmail :	email address shows on sidebar
	sitePath :	repository path of your site Content

