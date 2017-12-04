//npm  package for MySQL
var mysql = require("mysql");
//npm package for inquirer
var inquirer = require("inquirer");

//connect to local database
var connect = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: 'root',
	password: 'Willy0umarryme!',
	database: 'bamazon'
});

// global variable for last item id
var lastItem = 0;

// global variable for shoping cart array
var cart = [];
// global variable for shoping cart total
var cartTotal = 0;

connect.connect(function(err){
	if(err) throw err;
	showProducts();
});

// function to display all products in the database
function showProducts() {
    connect.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if(err) throw err;
        console.log("Bamazon Products");
        for(var i = 0; i < res.length; i++){
        	console.log("Item # " + res[i].item_id + " - " + res[i].product_name + " $" + res[i].price);
        	lastItem = i;      	
        }
        selectItem();
    });
}

// prompt the user to select an item
var selectItem = function(){
	inquirer.prompt([
	{
		name: "item",
		message: "Please enter the item number you would like to add to your cart. ",
		type: "input"
	}
	]).then(function(answers){
		if(parseFloat(answers.item) <= lastItem){
			connect.query("SELECT product_name, price, stock_quantity FROM products WHERE item_id =" + answers.item, function(err,res){
				if(err) throw err;
				console.log(res[0].product_name + " $" + res[0].price);
				var product = res[0].product_name;
				var price = res[0].price;
				var quantity = res[0].stock_quantity;
				selectQuantity(product, price, quantity);
			});
		} else{
			// prompt the user to select a different item
			console.log("Invalid item number.");
			selectItem();
		}
		
	})
};

// prompt the user to select a quantity
var selectQuantity = function(product, price, quantity){
	inquirer.prompt([
			{
				name: "quantity",
				message: "How many would you like? ",
				type: "input"
			}
			]).then(function(answers){
				// check the database if there is enough in stock
				if(parseFloat(answers.quantity) > quantity){
					console.log("Only " + quantity + " in stock.");
					selectQuantity(product, price, quantity);
				} else{
					var newQuantity = quantity - parseFloat(answers.quantity);
					//update database quantity
					connect.query("UPDATE products SET stock_quantity =? WHERE product_name =?", [newQuantity, product], function(err,res){
						if(err) throw err;
						var total = parseFloat(answers.quantity) * price;
						var newItem = new AddToCart(product, parseFloat(answers.quantity), total.toFixed(2));
						// push newly constructed object to the cart array
						cart.push(newItem);
						console.log("Added to Cart!");
						moreItems();
					});
				}
			});
};

// ask if the user wants to add more items to their cart
var moreItems = function(){
	inquirer.prompt([
		{
			name: "confirm",
			message: "Would you like to add more items?",
			type: "confirm"
		}
		]).then(function(answers){
			if(answers.confirm){
				selectItem();
			} else{
				console.log("Your Cart:");
				for(var i = 0; i < cart.length; i++){
					console.log(cart[i].quantity + " " + cart[i].product + " Total: $" + cart[i].total);
					cartTotal = cartTotal + parseFloat(cart[i].total);
				}
				console.log("Cart Total: $" + parseFloat(cartTotal).toFixed(2));
				// ask if the user wants to shop again
				inquirer.prompt([
					{
						name: "confirm",
						message: "Would you like to shop again?",
						type: "confirm"
					}
					]).then(function(answers){
						if(answers.confirm){
							showProducts();
						} else{
							process.exit();
						}
					});	
			}
		});
};

// constructor for users's cart array objects
function AddToCart(product, quantity, total){
	this.product = product,
	this.quantity = quantity,
	this.total = total
};