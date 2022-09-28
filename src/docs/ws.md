---
title: " v1.0.0"
language_tabs:
  - javascript--node: Node.JS
headingLevel: 3
toc_footers:
  - <a href="/docs">See Other REST endpoints</a>
includes: []
search: true
highlight_theme: darkula

---

# Angular NgRx Websocket Endpoint v1.0.0

> Scroll down for code samples, example headers and payloads. Select a language for code samples from the tabs above or the mobile navigation menu.

Documentation for the Angular NgRx Websocket Endpoint

Base URLs:

* <a href="http://localhost:{port}/chat/{chatId}/send">http://localhost:{port}/chat/{chatId}/send</a>

    * **chatId** - You can get your `chatId` from the GET /chats REST endpoint Default: 397fed73-4bcb-49ea-938b-74d4fe5ce811

    * **port** -  Default: 8080

* <a href="https://dev.angular-ngrx-chat.com/chat/{chatId}/send">https://dev.angular-ngrx-chat.com/chat/{chatId}/send</a>

    * **chatId** - You can get your `chatId` from the GET /chats REST endpoint Default: 397fed73-4bcb-49ea-938b-74d4fe5ce811

# Default

## action.send.message

<h3 id="action-send-message-publish">publish</h3>

> Example headers

```json

{
  "type": "object",
  "properties": {
    "Authorization": {
      "description": "Bearer {{Token}}"
    }
  }
}
```

> Example payload

```json

"Hello world!"
```

*Action to send a message.*

#### Headers

##### Properties

|Name|Type|Required|Description|
|---|---|---|---|
|» Authorization|any|false|Bearer {{Token}}|

#### Payload

##### Properties

*Message*

|Name|Type|Required|Description|
|---|---|---|---|
|*anonymous*|string|false|Message|

<aside class="success">
This operation does not require authentication
</aside>

## event.send.message

<h3 id="event-send-message-subscribe">subscribe</h3>

> Example payload

```json

{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "format": "uuid",
      "description": "The chat's unique identifier",
      "example": "c1604ce0-2280-47b6-8230-6429dd4b5dd9"
    },
    "chatName": {
      "type": "string",
      "description": "Name of chat",
      "example": "Actions and Reducers"
    },
    "messageId": {
      "type": "string",
      "format": "uuid",
      "description": "The message's unique identifier",
      "example": "deecd998-c552-40b6-868d-28f99a338fdd"
    },
    "message": {
      "type": "string",
      "description": "Name of chat",
      "example": "Hello world!"
    },
    "userId": {
      "type": "string",
      "format": "uuid",
      "description": "The user's unique identifier",
      "example": "5d99e226-7891-4ec6-8016-59ac86e1ace7"
    },
    "username": {
      "type": "string",
      "description": "Username of the user",
      "example": "Marshall"
    },
    "sentAt": {
      "type": "string",
      "description": "Message timestamp",
      "example": "2022-09-28T19:05:43.633Z"
    }
  }
}
```

#### Payload

##### Properties

|Name|Type|Required|Description|
|---|---|---|---|
|» chatId|string(uuid)|false|The chat's unique identifier|
|» chatName|string|false|Name of chat|
|» messageId|string(uuid)|false|The message's unique identifier|
|» message|string|false|Name of chat|
|» userId|string(uuid)|false|The user's unique identifier|
|» username|string|false|Username of the user|
|» sentAt|string|false|Message timestamp|

<aside class="success">
This operation does not require authentication
</aside>

