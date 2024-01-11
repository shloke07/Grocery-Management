# Grocery-Management

A simple Angular-Node based app to add and fetch grocery items.

## Technologies Used

- Angular 15
- Angular Material
- Node.js (Express.js)
- MySQL

## Getting Started

1. Clone the repo

2. Install NPM packages (in both Backend and Frontend/Grocery-app directories)

3. Run the server on port 3000 (use command `npm run start` in backend/ directory)

4. Launch the Angular app on port 4200 (use command `ng serve` in frontend/Grocery-app/ directory)

5. Navigate to `http://localhost:4200/` in your browser.

## Features

- Add and delete grocery items in Cart.
- Specify Quantity of items.
- Add the cart items to Inventory (database). (`/addItems`)
- Fetch all items from Inventory (database). (`/getItems`)
- View the fetched grocery items.  

## FAQ

- Make sure to configure proxy.conf.json file if you are running the servers on any other ports than specified.
- `/addItems` endpoint prevents adding items already existing in the inventory and is CASE SENSITIVE. So `Apples` and `apples` are considered different items.


## License

This project is licensed under the MIT License.
