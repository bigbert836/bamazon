# Bamazon Application

## Overview

Using node.js & mySQL, two applications have been created to provide online storefront functionality like Amazon.com.

## Customer Access

* Using the bamazonCustomer.js file in node, the customer is first provided with a list of available products.
* The customer is then prompted to enter the item number for the product that they would like to addd to the cart.

![screenshot](/assets/1.jpg)

* If the customer enters anything that is not a valid itme number, the customer is prompted to enter a new item number.

![screenshot](/assets/2.jpg)

* Once a valid item number has been entered by the customer, they are shown the product name & price and then asked for the quantity they would like.

![screenshot](/assets/3.jpg)

* If the customer enters a number that is higher than what is currently in stock, the quantity in stock is shown to the user and they are prompted to enter a new number.

![screenshot](/assets/4.jpg)

* Once the customer has entered a valid quantity, they are informed that the item(s) have been added to their cart.
* As items are added to the cart, quantites are decreased from the database.
* They are then asked if they would like to continue shopping.

![screenshot](/assets/5.jpg)

* If the customer would like to continue shopping, the same prompt is generated and more items can be added.

![screenshot](/assets/6.jpg)

* Once the customer is done shopping shopping, they are shown their entire cart.
* The cart shows the items, quantites, and calculated totals based on prices and quantities.
* The customer is also asked if they would like to shop again.

![screenshot](/assets/7.jpg)
