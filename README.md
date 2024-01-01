# html-selector
NodeJS library to select HTML code inside an arbitrary HTML page

## Install
```
npm install @winkgroup/html-selector
```

or

```
yarn add @winkgroup/html-selector
```

## Overview
This library injects a JS code to allow user to select multiple elements in the HTML page and send information to the window generating an event when user press ENTER. This library is intended to be used to generate HTML code inside an iframe.

Convention:
- every element selected has blue border
- current element selected has red border

## User Commands
- mouse click: a new element is selected or become current
- arrow up: move current selection to the parent element
- arrow down: move current selection to the first child element
- arrow left: move current selection to the previous sibling element
- arrow right: move current selection to the next sibling element
- tab: move current selection to the next seletected element
- enter: generate an event to the parent window (window.parent.postMessage) with these data:
```json
{
    "eventType": "htmlSelector",
    "list": [{
        "domPath": "body > div:eq(1) > ol > li:eq(0) > a",
        "html": "<a class=\"tocxref htmlSelectorSelected\" href=\"https://www.w3.org/TR/REC-html40/present/frames.html#h-16.1\">Introduction to frames</a>"
    },{
        ...
    }]
}
```

## Development
in ```playground``` folder you will find a working implementation of **html-selector**. You  can run it with ```npm run playground``` or ```yarn playground```

## Maintainers
* [fairsayan](https://github.com/fairsayan)