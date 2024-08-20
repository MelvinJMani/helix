# Docs

Helix is a static site generator that allows you to build websites quickly and efficiently using various templating engines like ejs or markdown. Below is a guide on how to install and use helix-static-gen and its main commands.

### Commands

- ##### helix-static-gen init

Initializes a new static site project in the current directory, setting up the necessary folder structure (pages, layouts, partials, assets).

- ##### helix-static-gen start [options]

Starts a development server, allowing you to preview your site locally. It watches for file changes and automatically rebuilds and refreshes the page.

- ##### helix-static-gen build [options]

Builds the static site, processing the layouts, pages, partials, and assets into the output directory (usually public).

### Options 

By default start command and build command will look for the a configuration file named ```site.config.cjs.```.  If you wish to use a different file, it will have to be supplied to the helix command:

```Bash
helix-static-gen start -c my-config.cjs
```

By default start command will start the local server at port 3000. If you wish to change that: 

```Bash
helix-static-gen start -p 8080
```

### Configuration

You can customize the source and output directories, as well as other options, using a configuration file. By default, this file is named ```site.config.js.```

__Example Configuration File__

```Javascript
module.exports = {
  build: {
    srcPath: './src',
    outputPath: './docs'
  },
  site: {
    title: 'Helix'
  }
};
```

### Sitemap Generation

The build command automatically generates a sitemap.xml file in the output directory (public). This XML file indexes all pages of the site with their URLs and last modification dates.

### Site Metadata

The ```site.config.js``` file can include metadata for the entire site, such as the site title and author, which can be used in templates.

You can also provide page-specific metadata using front matter in the page files, which can include titles, tags, and other information. This metadata is usually written in YAML format at the top of each page.

__Example of Page Metadata__

```YAML
---
title: My First Post
date: 2023-01-01
tags:
  - blog
  - personal
---
Contents of the page go here...
```
The page-specific metadata can be accessed in your layouts or pages using page object references.

### Layouts

Layouts are reusable templates for pages that define the common structure like headers, footers, and navigation. A layout file contains a placeholder <%- body %> where the content of the page is inserted.

Example Layout (layouts/default.ejs)

```HTML
<html>
  <head>
    <title><%= site.title %></title>
  </head>
  <body>
    <%- body %>
  </body>
</html>
```

### Multiple Layouts

You can use different layouts for different pages. Specify the layout in the front matter of the page:

```YAML
---
layout: minimal
---
Page content goes here...
```
This would use the ```layouts/minimal.ejs``` file for that page.

### Partials

Partials are reusable sections of HTML that can be included in layouts or pages. For example, to include a ```footer.ejs``` partial:

```EJS
<%- include('partials/footer') %>
```

### Assets

Static assets like CSS, JavaScript, and images should be placed in the assets folder. These will be copied over to the output directory during the build process.

### Pages 

The files that will generate the pages of your site must be located at the pages folder. Inside that folder you can have any number of .ejs, .md or .html files, and any number of sub folders. Each source file will generate a resulting html file, with the same folder structure, combining the layout structure with the page contents.

An extra folder will be created at the destination with the name of the original file (without extension) and the resulting page will be saved as index.html inside that folder, except when the name of the original file is already index. This simplify the URLs of the final site.

### URL and Canonical Tag Generation

Each page rendered by ```helix-static-gen``` has access to its relative URL via the ```templateConfig.path``` property. This path, when combined with the site data, allows you to generate canonical URLs for SEO purposes. For example, you can use the following code to add a canonical URL meta tag:

```html
<meta name="canonical" content="<%= site.domain + path %>">
```

This ensures that each page has a proper canonical URL, which is useful for search engines to index the correct page version.

