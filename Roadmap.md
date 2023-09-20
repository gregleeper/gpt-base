# Roadmap for AGA - Automated Grading Assistant

Right now there is only one way to set the context of the chat. That is in the cotext directory of the project. I would like to be able to set the context based on a user's input into a couple fields before beginning a chat session.

## Routes
In order to accomplish I think the app needs to be laid out in a struct like this

```
/routes
.. index.tsx // this will be where the user sets the context
.. chat.tsx // this is the grading session
.. login.tsx
.. logout.tsx
.. /auth // however this will work with remix-auth
```

## Storage

Maybe gonna use Turso for the sqlite storage. 

### Data Model

```prisma
model User {
    id UUID @id
    username String @unique
    password String
    contexts Context[]
}

model Context {
    id UUID @id
    rubric String
    prompt String
    userId UUID @relation(id, id)
    user User
}
```


