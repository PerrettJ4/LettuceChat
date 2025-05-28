# LettuceChat

Okay yeah I spent 5 hours on this (I did have lunch).<br/>
This application is built with Node.js, PostgreSQL, and Next.js, and leverages localStorage to enable some offline functionality.

and it's not perfect but it does:

- ✅ Users should be able to add and remove chat groups.  
- ✅ Users should be able to send messages to individual chat groups.  
- ❌ Users should be able to join any available chat groups.  
- ✅ Users are happy to wait 5-10 seconds for new messages to appear after they are sent.

In terms of offline use it does only:  
- ✅ Users should be able to send messages to individual chat groups.

But the reasoning and logic is there for polling and the use of local storage and isOnline context to send pending actions.

---

### Other major bugs include:
- Lack of information on group chats: i.e. last message, unread messages, group image  
- Group names not present in chat, only ID
- tiny blip when reloading messages after coming back online
- Flickering re-renders due to polling
- Going in and out of chat in offline mode won't render chat

---

## How To Run


### Setting up your PostgreSQL connection

Before running the backend, you will need to configure your own PostgreSQL connection details:

1. **Create a PostgreSQL user and database** on your machine if you haven't already.
2. **Update the connection string** in the backend configuration (usually in a `.env` file or config file) with your local PostgreSQL credentials. For example: DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database
3. Make sure PostgreSQL is running and accessible.


### To run the database setup command to initialize tables:



1. Clone this repo  
2. `cd` into `/node` and run:
   ```bash
   npm i
   npm run db:setup
   npm run dev

### To run next js FE
1. `cd` into `/ui` and run:
    ```bash
     npm i
     npm run dev



