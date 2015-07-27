# LucyBot recipes for the Kaltura API

## Installation
```bash
git clone https://github.com/bobby-brennan/kaltura-recipes.git && cd kaltura-recipes
git submodule init && git submodule update # You'll need access to bobby-brennan/lucy-langs
cd lucy-langs && npm install && cd ..
npm install
```

## Startup
To use in development mode, run
```bash
export KALTURA_RECIPES_PORT=3000
export LUCYBOT_DEV=true
node server.js
```

To use in production, run
```bash
export KALTURA_RECIPES_PORT=443
sudo node server.js
```

You can use packages like [forever](https://www.npmjs.com/package/forever) to keep the service running in the background.

```bash
npm install -g forever
forever start server.js
```

## Overview

This repository contains tutorials - known as recipes - for working with Kaltura's API. The repository is structured as follows:
* ```recipes/``` - a set of JSON objects, each corresponding to a single tutorial.
* ```code_templates/``` - Kaltura-specific templates which are passed to the LucyBot code builders.
* ```code_templates/views/``` - HTML templates for displaying the results of the API. Views starting with ```Kaltura``` correspond to specific objects in Kaltura's API schema; e.g. ```KalturaMediaEntry.html``` is the HTML for displaying a [KalturaMediaEntry](https://www.kaltura.com/api_v3/testmeDoc/index.php?object=KalturaMediaEntry). Note that files under ```code_templates/views/html/``` are used by default, but can be overriden for a specific language by placing a view with the same filename under ```code_templates/views/language_name``` (e.g. to use the jquery-fileupload library when working in javascript).
* ```code_templates/actions/``` - Templates for making calls to the API in different languages. There is a subdirectory for each language.
* ```code_templates/generic_actions/``` - There is one template in here for each supported language. These templates are special in that they don't produce working code; rather, they produce the templates that would normally be found in ```code_templates/actions/```. These templates use Kaltura's API Schema to automatically generate action templates.

Other directories control the webserver:
* ```routes/``` contains a set of Express routers, which control what paths are served by the webserver
* ```views/``` is a set of Jade templates for displaying recipes to the user
* ```static/``` contains CSS, JavaScript, and images, and are served without processing
* ```less/``` contains LESS files for generating CSS
* ```scripts/``` contains helpful scripts for doing things like compiling LESS to CSS
* ```test/``` contains the test files, along with golden files for tracking changes to the generated code.
 
Finally, the LucyBot code buildier libraries are contained in the Git Submodule ```lucy-langs```. To update to the latest version, simply enter the directory and run ```git pull```.

## Adding a New Recipe

Recipes are controlled by the JSON files under ```recipes/```. To add a new recipe, simply create a new JSON file in that directory. JSON is structured as follows:

```json
{
  "name": "the name of this file",
  "title": "the title of the recipe",
  "icon": "the name of a fontawesome icon",
  "description": "A short description of the recipe",
  
  "control_sets": "this is an array of steps for the recipe, structured as below",
  "control_sets": [
    {
      "title": "A title for this step",
      "page": "The index of the Single Page App to show below the recipe (see array 'pages' below)",
      "tip": "The body of text for this recipe. Markdown is supported here so you can [create links](www.google.com) or call out ```snippetsOf.code()```",
      "affects": "The name of a view or action pertinent to this step. This controls what snippet of sample code is displayed to the user",
      "inputs": "An array of HTML inputs to display to the user. Fields entered here can be used in your recipes or embedded in the sample code",
      "inputs": [
        {
          "name": "The programmatic name of the input. Should match propery names in Kaltura's API schema where applicable",
          "default": "The default value to use (optional)",
          "type": "text|number|radio|select|select-chosen",
          "label": "A human-readable label for the input",
        }
      ],
      
    }
  ],
  "pages": "An array of single page apps to generate along side this recipe.",
  "pages": [
    {
      "view": "The name of the main view for this recipe, e.g. KalturaMediaListResponse.",
      "data": {
        "action": "The action that supplies the data for the initial load of this page"
      }
    }
  ],
  "view": "An array of views that are used in this recipe. This should contain any views listed in 'pages' above, along with any views they <lucy include> (e.g. KalturaMediaListResponse includes the KalturaMediaEntry view)",
  "views": [
    "myView"
  ],
  "actions": "An array of actions that are used in this recipe.",
  "actions": [{
    "service": "(optional) The name of a Kaltura service. This allows the action to be auto-generated by the templates in the generic_actions/ directory",
    "action": "The name of the action. Should be the name of a Kaltura action if service is specified",
    "view": "A view for displaying this action's output, e.g. KalturaMediaListResponse for media.list"
  }]
}
```

## Adding a new View

Views are snippets of HTML for displaying responses from the API. Any valid HTML can be used here, including ```<script>``` and ```<style>``` tags.

LucyBot also provides some helper tags:
* Use ```{{ variable.name }}``` to print the value of a given variable
* Use ```<lucy for="thing" in="array">``` to iterate over an array
* Use ```<lucy if="condition">``` to add conditionals
* Use ```<lucy include="ViewName">``` to include other views

You have access to two global variables inside of your views:
* ```result``` which is the API's response (but can be overriden via ```<lucy include>```)
* ```answers``` which contains the user's responses from inside the recipe

```<lucy include>``` can operate in two different ways:
1. It can simply copy the HTML of the included view
2. It can make a new call to the API, and use the included view as a template for displaying the result.

Case (1) is the default behavior. In addition, you can use ```<lucy include="ViewName" resultvar="foo">``` to use variable "foo" in place of API output. For example, since KalturaMediaListResponse is just an array of KalturaMediaEntry, we can have:
```html
<lucy for="video" in="result">
  <lucy include="KalturaMediaEntry" resultvar="video"></lucy>
</lucy>
```

This allows us to use the same KalturaMediaEntry template whether we're using ```media.list``` or ```media.get```.

Case (2) is useful if you need more data from the API. You can specify ```action```, which is the name of the action to use, and ```inputvars``` which is a mapping from variable names to API inputs.

If, for example, KalturaMediaListResponse was just an array of entryIds, we could do:

```html
<lucy for="entryId" in="result">
  <lucy include="KalturaMediaEntry" action="getMedia" inputvars="{id: entryId}"></lucy>
</lucy>
```

