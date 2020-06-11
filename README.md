- [Project Plan](#project-plan)
  - [Idea](#idea)
    - [The Process](#the-process)
    - [The Problems](#the-problems)
    - [The Solution](#the-solution)
  - [Features](#features)
    - [MVP](#mvp)
    - [Stretch Goals](#stretch-goals)
  - [Views](#views)
    - [Landing Page](#landing-page)
    - [Home Page](#home-page)
    - [Form Page](#form-page)
  - [Routes](#routes)
  - [Database](#database)
      - [users](#users)
      - [user_groups](#user_groups)
      - [guests](#guests)
      - [tickets](#tickets)
      - [ticket_type](#ticket_type)
      - [ticket_status](#ticket_status)
      - [ticket_msgs](#ticket_msgs)
      - [ticket_attachments](#ticket_attachments)
      - [delivery_prep](#delivery_prep)
      - [delivery_prep_status](#delivery_prep_status)
      - [delivery_prep_task](#delivery_prep_task)
      - [print_queue](#print_queue)
      - [print_queue_status](#print_queue_status)
      - [delivery_prep_task](#delivery_prep_task-1)
  - [Endpoints](#endpoints)
    - [GET '/api/tickets'](#get-apitickets)
    - [GET '/api/ticket/:ticketid'](#get-apiticketticketid)

# Project Plan

## Idea

The Hub is an internal communication, collaboration, and data collection tool for a high-volume, ‘single point of contact’ oriented retail automotive sales department. This first production app will be specifically designed for Sonic Automotive's Echo Park stores.

### The Process

In order to understand the problem, we must first understand the process:

1. Guest is matched with an Experience Guide (EG) who is their single point of contact throughout the entire sales process. This means _the guest does not typically communicate with the finance team directly during the purchase process._
2. Guest selects a vehicle they are interested in purchasing. **(Guest could be in person or remote)**
3. EG conducts guest interview to:
   1. Determine method of payment
      1. Cash
      2. Financing
   2. Discover/discuss needs and expectations such as:
      - Down payment
      - Monthly payment
      - Term length
      - Interest rate
      - Credit worthiness
   3. Collect all necessary personal and financial information
   4. Load information into CRM (every time) and Credit Processing Software (if applicable)
4. EG finds an available Finance Manager to:
   1. Relay details of interview
   2. Collaborate on ways to meet guest's needs
   3. Discover any additional information they may need from the guest.
5. Finance manager begins working on structuring deal and communicating with lenders (if applicable)
6. EG communicates time estimate to guest
7. When deal is ready, EG presents purchase agreement to guest.
   1. Guest agrees:
      1. EG:
         1. Schedule delivery with guest (if remote)
         2. Print deal jacket with all guest documents and deliver to Finance
         3. Communicate with Sales Suppport team to schedule vehicle make-ready
      2. Finance Manager:
         1. Ensure deal is fundable
         2. Process deposit
         3. Mark deal as sold
         4. Communicate with doc specialst team for contract printing
      3. Doc specialist:
         1. Prepare all necessary contracts at time of delivery
         2. Ensure contracts are completed correctly
      4. Sales Support:
         1. Fill vehicle with gas
         2. Deliver vehicle to detail
         3. Communicate with EG when vehicle is ready
   2. Guest does not agree:
      1. EG:
         1. Communicate and collaborate with Finance Manager
      2. Finance Manager:
         1. Rehash and restructure deal to earn guest's business and maximize profitability
         2. Communicate with EG when deal is structured and ready
      3. Repeat until guest's needs are met.

### The Problems

At a small volume (~15-20 EGs and ~3-4 finance managers) the above process can be fulfilled manually with minimal negative impact to guest experience. However, as you scale and 60-70 EGs are each balancing multiple guests at a time and 8-10 Finance Managers are each handling multiple deals at a time, the guest experience degrades without a system to support:

- How does an EG get matched up with an available finance manager when every finance manager is currently working on deals?
- How do you ensure you prioritize guests who are in the building?
- What if the finance manager who worked a deal is off?
  - How does another finance manager get caught up to speed on the deal?
- How does an EG accurately communicate ETA to a guest?
- How does an EG know when their guest's purchase agreement is prepared?
- How does Sales Support know a vehicle is sold and needs to begin make ready process?
- How does the Doc Specialist team keep track of deals they need to print?
- How does leadership track each individual finance manager's total volume when there is no single system to track?

### The Solution

The Hub creates one place to submit, track, and analyze metrics for these internal processes.

## Features

### MVP

- EGs can create new finance app in The Hub and enters details of guest needs and expectations and whether guest is in the showroom or not.
- File upload to form
- The app is assigned to an available Finance Manager via round-robin
- Finance Manager can toggle availability on and off.
- Finance Manager able to record internal notes only visible to other Finance Managers
- Finance Manager and EGs can send messages
- Entire history of all changes to a deal recorded in an audit.
- Deal status changes trigger email notification to correct party.
- When deal status is marked sold, EG can schedule delivery which will:
  - Add vehicle details to Sales Support's make-ready queue
  - Add deal to Doc Specialist's print queue
- Multiple "Queue Views" to be displayed on TVs in the office for at a glance status of all current deals
- Detailed performance metrics for the entire sales team.
- Admin users for EG, Finance, Doc Spec, and Sales Support can configure statuses and triggers.
- Tablet optimized views for retina iPad
- Collapsible main navigation menu

### Stretch Goals

- Load balancing round-robin distribution with configurable preferences
- Smart ETA for each deal based on current system load
- Azure Active Directory integration
- SMS and push notifications
- Finance Manager scheduled availability
- Link with Inventory System
- Link with CRM/DMS

## Views

### Landing Page

### Home Page

### Form Page

## Routes
- / -> Login
- /home -> Home
- /new -> New App Form
- /finance -> Finance Queue
- /finance/:appid -> Specific App
- /deliveryprep -> Delivery Prep Queue
- /printqueue -> Print Queue

## Database

#### users

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>email</td><td>EMAIL</td></tr>
<tr><td>password</td><td>TEXT</td></tr>
<tr><td>first_name</td><td>VARCHAR(50)</td></tr>
<tr><td>last_name</td><td>VARCHAR(50)</td></tr>
<tr><td>phone</td><td>VARCHAR(10)</td></tr>
<tr><td>resetCount</td><td>INT</td></tr>
<tr><td>requireReset</td><td>BOOL</td></tr>
<tr><td>lastResetTime</td><td>TIMESTAMPTZ(2)</td></tr>
<tr><td>lastVisitDate</td><td>TIMESTAMPTZ(2)</td></tr>
<tr><td>activation</td><td>TEXT</td></tr>
<tr><td>user_type</td><td>INT FK user_groups(id)</td></tr>
</table>

#### user_groups

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>name</td><td>VARCHAR(50)</td></tr>
</table>

#### guests

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>guest_name</td><td>VARCHAR(200)</td></tr>
<tr><td>guest_phone</td><td>VARCHAR(10)</td></tr>
<tr><td>eg_id</td><td>INT FK users(id)</td></tr>
</table>

#### tickets

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>guest_id</td><td>INT FK guests(id)</td></tr>
<tr><td>eg_id</td><td>INT FK users(id)</td></tr>
<tr><td>finance_id</td><td>INT FK users(id)</td></tr>
<tr><td>ticket_type</td><td>INT FK ticket_type(id)</td></tr>
<tr><td>ticket_status</td><td>INT FK ticket_status(id)</td></tr>
<tr><td>stock</td><td>VARCHAR(10)</td></tr>
<tr><td>pmt</td><td>INT</td></tr>
<tr><td>down_pmt</td><td>INT</td></tr>
<tr><td>created</td><td>TIMESTAMPTZ(2) DEFAULT now()</td></tr>
<tr><td>updated</td><td>TIMESTAMPTZ(2)</td></tr>
<tr><td>closed</td><td>TIMESTAMPTZ(2)</td></tr>
</table>

#### ticket_type

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>name</td><td>VARCHAR(50)</td></tr>
</table>

#### ticket_status

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>name</td><td>VARCHAR(50)</td></tr>
</table>

#### ticket_msgs

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>ticket_id</td><td>INT FK tickets(id)</td></tr>
<tr><td>user_id</td><td>INT FK users(id)</td></tr>
<tr><td>private</td><td>BOOL</td></tr>
<tr><td>message</td><td>TEXT</td></tr>
<tr><td>timestamp</td><td>TIMESTAMPTZ(2) DEFAULT now()</td></tr>
</table>

#### ticket_attachments

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>guest_id</td><td>INT FK guests(id)</td></tr>
<tr><td>ticket_id</td><td>INT FK tickets(id)</td></tr>
<tr><td>user_id</td><td>INT FK users(id)</td></tr>
<tr><td>filepath</td><td>TEXT</td></tr>
<tr><td>timestamp</td><td>TIMESTAMPTZ(2) DEFAULT now()</td></tr>
</table>

#### delivery_prep

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>guest_id</td><td>INT FK guests(id)</td></tr>
<tr><td>ticket_id</td><td>INT FK tickets(id)</td></tr>
<tr><td>eg_id</td><td>INT FK users(id)</td></tr>
<tr><td>support_id</td><td>INT FK users(id)</td></tr>
<tr><td>status</td><td>INT FK delivery_prep_status(id)</td></tr>
<tr><td>next_status</td><td>INT FK delivery_prep_status(id)</td></tr>
<tr><td>created</td><td>TIMESTAMPTZ(2) DEFAULT now()</td></tr>
<tr><td>updated</td><td>TIMESTAMPTZ(2)</td></tr>
<tr><td>closed</td><td>TIMESTAMPTZ(2)</td></tr>
</table>


#### delivery_prep_status

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>name</td><td>VARCHAR(50)</td></tr>
<tr><td>order</td><td>INT</td></tr>
</table>

#### delivery_prep_task

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>delivery_id</td><td>INT FK delivery_prep(id)</td></tr>
<tr><td>user_id</td><td>INT FK users(id)</td></tr>
<tr><td>new_status</td><td>INT FK delivery_prep_status(id)</td></tr>
<tr><td>notes</td><td>VARCHAR(500)</td></tr>
<tr><td>timestamp</td><td>TIMESTAMPTZ(2) DEFAULT now()</td></tr>
</table>

#### print_queue

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>guest_id</td><td>INT FK guests(id)</td></tr>
<tr><td>ticket_id</td><td>INT FK tickets(id)</td></tr>
<tr><td>eg_id</td><td>INT FK users(id)</td></tr>
<tr><td>support_id</td><td>INT FK users(id)</td></tr>
<tr><td>status</td><td>INT FK print_queue_status(id)</td></tr>
<tr><td>next_status</td><td>INT FK print_queue_status(id)</td></tr>
<tr><td>created</td><td>TIMESTAMPTZ(2) DEFAULT now()</td></tr>
<tr><td>updated</td><td>TIMESTAMPTZ(2)</td></tr>
<tr><td>closed</td><td>TIMESTAMPTZ(2)</td></tr>
</table>

#### print_queue_status

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>name</td><td>VARCHAR(50)</td></tr>
<tr><td>order</td><td>INT</td></tr>
</table>

#### delivery_prep_task

<table>
<tr><th>Name</th><th>Type/Constraints</th></tr>
<tr><td>id</td><td>SERIAL PK</td></tr>
<tr><td>print_id</td><td>INT FK print_queue(id)</td></tr>
<tr><td>user_id</td><td>INT FK users(id)</td></tr>
<tr><td>new_status</td><td>INT FK print_queue_status(id)</td></tr>
<tr><td>notes</td><td>VARCHAR(500)</td></tr>
<tr><td>timestamp</td><td>TIMESTAMPTZ(2) DEFAULT now()</td></tr>
</table>

## Endpoints

### GET '/api/tickets'
```
req: none
res: [
   {
   ticket_id: 1,
   guest_id: 1,
   eg_id: 1,
   finance_id: 1,
   guest: 'Fred Bob',
   guest_phone: '2141231234',
   eg: 'Bob Fred',
   finance: 'George Bob',
   type: 'Finance',
   status: 'New Submittal',
   stock: 'PJJ123123',
   created: '2020-06-12 10:23:54+02',
   updated: '2020-06-12 10:23:54+02',
   closed: '',
}
]
```

### GET '/api/ticket/:ticketid'
```
req: req.params.ticketid
res: {
   ticket_id: 1,
   guest_id: 1,
   eg_id: 1,
   finance_id: 1,
   guest: 'Fred Bob',
   eg: 'Bob Fred',
   finance: 'George Bob',
   type: 'Finance',
   status: 'New Submittal',
   stock: 'PJJ123123',
   created: '2020-06-12 10:23:54+02',
   updated: '2020-06-12 10:23:54+02',
   closed: '',
}
```