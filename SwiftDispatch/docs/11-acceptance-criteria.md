# Acceptance Criteria
## SwiftDispatch

**Format:** Given / When / Then (BDD-style)

---

## Authentication

### AC-AUTH-01: Customer Registration
```
Feature: Customer Registration

Scenario: Successful registration
  Given I am on the Register screen
  When I complete all 3 steps with valid name, email, phone, password, and role = "customer"
  And I tap "Create Account"
  Then I am redirected to the Customer Home screen
  And I am logged in
  And my name appears in the greeting

Scenario: Duplicate email
  Given a user with email "test@example.com" already exists
  When I try to register with the same email
  Then I see an alert: "An account with this email already exists"
  And I remain on the Register screen

Scenario: Weak password
  Given I am on Step 2 of registration
  When I enter a password with fewer than 6 characters
  And I tap "Continue"
  Then I see an inline error: "Minimum 6 characters"
  And I am not advanced to Step 3
```

---

### AC-AUTH-02: Login
```
Feature: User Login

Scenario: Successful login as customer
  Given I am on the Login screen
  When I enter valid credentials for a customer account
  And I tap "Sign In"
  Then I am redirected to the Customer Home screen

Scenario: Successful login as rider
  Given I am on the Login screen
  When I enter valid credentials for a rider account
  And I tap "Sign In"
  Then I am redirected to the Rider Dashboard

Scenario: Wrong password
  Given I am on the Login screen
  When I enter the correct email but wrong password
  And I tap "Sign In"
  Then I see an alert: "Invalid email or password"
  And I remain on the Login screen

Scenario: Demo mode
  Given I am on the Login screen
  When I tap "Customer Demo"
  Then I am taken to the Customer Home screen with mock user "Demo Customer"
  And no API call is made
```

---

## Booking

### AC-BOOK-01: Full Booking Flow
```
Feature: Customer Booking

Scenario: Successful order creation
  Given I am logged in as a customer
  And I am on the Booking screen
  When I enter a valid pickup address
  And I enter a valid dropoff address
  And I select "SwiftBike" as the vehicle type
  And I tap "Confirm Booking" on the summary screen
  Then I am redirected to the Tracking screen
  And the order status shows "Searching for a rider..."
  And a POST request is made to /api/orders

Scenario: Price calculation
  Given the pickup and dropoff are 5 km apart
  When I select SwiftBike (base ₦300 + ₦80/km)
  Then the displayed price is ₦700
  (₦300 + (5 × ₦80) = ₦700, rounded to nearest ₦10)

Scenario: Missing dropoff address
  Given I am on Booking Step 1
  When I leave the dropoff field empty
  And I tap "Continue"
  Then I see a validation error: "Drop-off address is required"
  And I am not advanced to Step 2
```

---

## Rider Flow

### AC-RIDER-01: Accept and Complete Delivery
```
Feature: Rider Order Acceptance

Scenario: Rider accepts an order
  Given I am logged in as a rider
  And I have toggled my status to "Online"
  When a new order is broadcast
  Then I see the incoming order modal with:
    - Customer name and rating
    - Pickup address and distance
    - Dropoff address and price
    - A 30-second countdown bar
  When I tap "Accept"
  Then the modal closes
  And I see the Active Order screen with the route to pickup
  And the customer's tracking screen updates to show my location

Scenario: Countdown expires
  Given I see the incoming order modal
  When 30 seconds pass without a response
  Then the modal closes automatically
  And the order is re-queued for another rider

Scenario: Complete delivery
  Given I have accepted an order and collected the package
  When I tap "Delivered" on the Active Order screen
  Then the order status changes to "delivered"
  And my earnings are updated by the order amount
  And my trip count increments by 1
  And the customer receives a delivery notification
```

---

## Real-Time Tracking

### AC-TRACK-01: Customer Tracking Screen
```
Feature: Live Delivery Tracking

Scenario: Rider location visible on map
  Given I have an active order with an assigned rider
  When I open the Tracking screen
  Then I see a map with the rider's current location marker
  And the marker moves as the rider moves

Scenario: Status updates
  Given my order is in "accepted" status
  When the rider marks themselves as arrived at pickup
  Then my order status updates to "At Pickup"
  And I receive an in-app notification

Scenario: Delivery completion
  Given my order is in "in_transit" status
  When the rider marks the order as delivered
  Then my order status updates to "Delivered"
  And I am prompted to rate the delivery
```

---

## Ratings

### AC-RATE-01: Post-Delivery Rating
```
Feature: Order Rating

Scenario: Rating submission
  Given my order has been delivered
  When I am on the Rate Order screen
  And I tap 5 stars
  And I tap "Submit Rating"
  Then the order status changes to "rated"
  And the rider's average rating is updated
  And I am redirected to the Customer Home screen

Scenario: Rating required
  Given I am on the Rate Order screen
  When I try to submit without selecting any stars
  Then I see an error: "Please select a rating"
  And the form is not submitted
```

---

## Order History

### AC-HIST-01: Orders Screen
```
Feature: Order History

Scenario: Active orders tab
  Given I have 1 order in "in_transit" status
  When I open the Orders screen
  Then the "Active (1)" tab is shown
  And I see my in-transit order with a "Track" link

Scenario: Empty history tab
  Given I have no past orders
  When I tap the "History" tab
  Then I see an empty state with the message "No past orders"
  And no order cards are shown
```

---

## Earnings

### AC-EARN-01: Rider Earnings Dashboard
```
Feature: Rider Earnings

Scenario: Earnings after delivery
  Given I have completed 3 deliveries worth ₦1,850, ₦2,400, and ₦950
  When I open the Earnings screen
  Then the total weekly earnings shows ₦5,200 (or more if week has more entries)
  And each transaction appears in the recent transactions list with a "+" prefix

Scenario: Withdrawal entry
  Given a withdrawal of ₦5,000 was processed
  When I view the transactions list
  Then the withdrawal entry shows "-₦5,000" in red
  And the icon is "business-outline" (bank icon)
```

---

## Draggable Bottom Sheet

### AC-UI-01: Map Panel Drag
```
Feature: Draggable Bottom Sheet

Scenario: Drag down to minimise
  Given I am on the Customer Home or Rider Dashboard screen
  When I drag the bottom sheet handle downward
  Then the panel slides down
  And snaps to a position where only the drag handle is visible
  And the map fills the full screen

Scenario: Drag up to restore
  Given the bottom sheet is in the minimised position
  When I drag the handle upward
  Then the panel springs back to its normal expanded position
```
