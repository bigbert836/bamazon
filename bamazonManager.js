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

var itemArray = [];

connect.connect(function(err){
	if(err) throw err;
	console.log("Welcome Manager!")
	loadMenu();
});

function loadMenu(){
	inquirer.prompt([
	{
		name: "managerMenu",
		message: " Please make a selection:",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
		type: "list"
	}
	]).then(function(answers){
		switch (answers.managerMenu) {
			case "View Products for Sale":
				showProducts();
				break;
			case "View Low Inventory":
				lowInventory();
				break;
			case "Add to Inventory":
				addInventory();
				break;
			case "Add New Product":
				addProduct();
				break;
		}
	})
};

function showProducts(){
    connect.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if(err) throw err;
        console.log("All Bamazon Products");
        for(var i = 0; i < res.length; i++){
        	console.log("Item # " + res[i].item_id + " - " + res[i].product_name + " $" + res[i].price + " " + res[i].department_name + " Department In Stock: " + res[i].stock_quantity);      	
        }
        loadMenu();
    });
}

function lowInventory(){
	connect.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
        if(err) throw err;
        console.log("Low Stock Bamazon Products");
        for(var i = 0; i < res.length; i++){
        	console.log("Item # " + res[i].item_id + " - " + res[i].product_name + " $" + res[i].price + " " + res[i].department_name + " Department In Stock: " + res[i].stock_quantity);      	
        }
        loadMenu();
    });
}

function addProduct(){
	console.log("Add New Product");
	inquirer.prompt([
	{
		name: "name",
		message: "Product Name:",
		type: "input"
	},
	{
		name: "department",
		message: "Department:",
		type: "input"
	},
	{
		name: "price",
		message: "Unit Price:",
		type: "input"
	},
	{
		name: "quantity",
		message: "Stock Quantity:",
		type: "input"
	}
	]).then(function(answers){
		connect.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answers.name + "', '" + answers.department + "', " + answers.price + ", " + answers.quantity + ")", function(err, res){
		if(err) throw err;
		console.log("New Item Added!");
		loadMenu();
		});
	});
}

function addInventory(){
	connect.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        if(err) throw err;
        for(var i = 0; i < res.length; i++){
        	var item = res[i].product_name;
   			itemArray.push(item);     	     	
        }
        inquirer.prompt([
        {
        	name: "name",
        	message: "Select Item",
        	choices: itemArray,
        	type: "list"
        },
        {
        	name: "quantity",
        	message: "New Quantity",
        	type: "input"
        }
        ]).then(function(answers){
        	connect.query("UPDATE products SET stock_quantity =? WHERE product_name =?", [answers.quantity, answers.name], function(err,res){
				if(err) throw err;
				console.log("Quantity Updated!");
				loadMenu();
        	})
    	});
	});
}
