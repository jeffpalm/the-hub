- [Project Plan](#project-plan)
  - [Idea](#idea)
  - [Target User](#target-user)
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
  - [Endpoints](#endpoints)
    - [GET '/api/tickets'](#get-apitickets)
    - [GET '/api/ticket/:ticketid'](#get-apiticketticketid)

# Project Plan

## Idea

The Hub is an internal communication, collaboration, task management, and data collection platform for high-volume, ‘single point of contact’ retail automotive sales departments. This first production app will be specifically designed for Sonic Automotive's Echo Park stores.

## Target User

Retail auto sales employees

### The Process

In order to understand the problem, we must first understand the process:

1. Guest is matched with an Experience Guide (Sales Rep) who is their single point of contact throughout the entire sales process. This means _the guest does not typically communicate with the finance team directly during the purchase process._
2. Guest selects a vehicle they are interested in purchasing. **(Guest could be in person or remote)**
3. Sales Rep conducts guest interview to:
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
4. Sales Rep finds an available Finance Manager to:
   1. Relay details of interview
   2. Collaborate on ways to meet guest's needs
   3. Discover any additional information they may need from the guest.
5. Finance manager bSales Repins working on structuring deal and communicating with lenders (if applicable)
6. Sales Rep communicates time estimate to guest
7. When deal is ready, Sales Rep presents purchase agreement to guest.
   1. Guest agrees:
      1. Sales Rep:
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
         2. Deliver vehicle to detail0.
         3. Communicate with Sales Rep when vehicle is ready
   2. Guest does not agree:
      1. Sales Rep:
         1. Communicate and collaborate with Finance Manager
      2. Finance Manager:
         1. Rehash and restructure deal to earn guest's business and maximize profitability
         2. Communicate with Sales Rep when deal is structured and ready
      3. Repeat until guest's needs are met.

### The Problems

At a small volume (~15-20 Sales Reps and ~3-4 finance managers) the above process can be fulfilled manually with minimal nSales Repative impact to guest experience. However, as you scale and 60-70 Sales Reps are each balancing multiple guests at a time and 8-10 Finance Managers are each handling multiple deals at a time, the guest experience dSales Reprades without a system to support:

- How does a Sales Rep get matched up with an available finance manager when every finance manager is currently working on deals?
- How do you ensure you prioritize guests who are in the building?
- What if the finance manager who worked a deal is off?
  - How does another finance manager get caught up to speed on the deal?
- How does a Sales Rep accurately communicate ETA to a guest?
- How does a Sales Rep know when their guest's purchase agreement is prepared?
- How does Sales Support know a vehicle is sold and needs to bSales Repin make ready process?
- How does the Doc Specialist team keep track of deals they need to print?
- How does leadership track each individual finance manager's total volume when there is no single system to track?

### The Solution

The Hub creates one place to submit, track, and analyze metrics for these internal processes and tasks.

## Features

### MVP

- Sales Reps can...
  - Create a new guest ticket
  - Edit existing ticket 
  - Attached relevant files to guest ticket
  - Post messages to ticket
  - Be notified via SMS when ticket is updated
- Ticket is assigned to **available** managers via **load-balancing round-robin**
- Managers can...
  - View all tickets
  - Change ticket status
  - Post messages to ticket for Sales Rep
  - Post messages to ticket for other Managers
  - Be alerted when a new ticket is assigned to them
- Admins can...
  - 

### Stretch Goals

- Smart ETA for each deal based on current system load
- Azure Active Directory intSales Repration
- SMS and push notifications
- Finance Manager scheduled availability
- Link with Inventory System
- Link with CRM/DMS
- Sales reps ca Schedule SMS and push notifications
- Create schedule for user-groups

## Views

### Landing Page

### Home Page

### Form Page

## Routes
- / -> Login
- /hub -> Home dashboard
- /settings -> User settings
- /tickets -> All tickets 
- /tickets/new -> New Ticket Form
- /tickets/:ticketid -> Specific Ticket
- /queues -> All Ticket Queues
- /queue/:queueid -> Specific Queue
- /queue/:queueid/:taskid -> Specific Task

## Database

[dbdiagram](https://dbdiagram.io/d/5ee40e849ea313663b3a7a18)

## Endpoints

### GET '/api/tickets'
```
req: none
res: [
   {
   ticket_id: 1,
   guest_id: 1,
   sales_id: 1,
   finance_id: 1,
   guest: 'Fred Bob',
   guest_phone: '2141231234',
   Sales Rep: 'Bob Fred',
   finance: 'George Bob',
   type: 'Finance',
   status: 'New Submittal',
   stock: 'PJJ123123',
   created: '2020-06-12 10:23:54+02',
   updated: '2020-06-12 10:23:54+02',
   closed: '',
},...
]
```

### GET '/api/ticket/:ticketid'
```
req: req.params.ticketid
res: {
   ticket_id: 1,
   guest_id: 1,
   sales_id: 1,
   finance_id: 1,
   guest: 'Fred Bob',
   Sales Rep: 'Bob Fred',
   finance: 'George Bob',
   type: 'Finance',
   status: 'New Submittal',
   stock: 'PJJ123123',
   created: '2020-06-12 10:23:54+02',
   updated: '2020-06-12 10:23:54+02',
   closed: '',
}
```