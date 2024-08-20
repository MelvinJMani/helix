# Helix

Helix is a versatile and powerful static site generator designed for developers who need a seamless and efficient workflow. With support for multiple template engines like EJS, Handlebars, and Pug, Helix allows you to create dynamic, content-rich websites with ease. Its intuitive CLI and live reloading server make development fast and enjoyable, while its modular architecture ensures your projects stay scalable and maintainable.

Inspired by Douglas Matoso's [nanogen](https://github.com/doug2k1/nanogen).

## Features

- **Support for Multiple Template Engines:** Use EJS and Markdown to create your pages.
- **Flexible Layouts:** Apply consistent headers, footers, and navigation across multiple pages using layout files.
- **Partials Support:** Reuse common components across your site for cleaner, more maintainable code.
- **Global Site Configuration:** Manage site-wide settings with a global config file.
- **JSON Data Integration:** Easily iterate over JSON data to generate dynamic pages, such as a project list.
- **Live Reloading Development Server:** Instantly preview changes as you develop with a built-in dev server.
- **CSS/JS Preprocessor Support:** Integrate your favorite CSS and JavaScript pre-processors for a modern development workflow.
- **Chalk-Powered Console Output:** Enjoy better console output with enhanced readability and error handling.

## Installation

To install Helix globally using npm:

```bash
npm install -g helix-static-gen
```

Or using Yarn:

```bash
yarn add -g helix-static-gen
```

## Usage

### Initialize a New Site

To initialize a new Helix site, simply run:

```bash
helix-static-gen init
```

This will create a new project structure with the necessary files to get started.

### Start the Development Server

To start the local development server with live reloading:

```bash
helix-static-gen start -p 3000
```

You can specify a different port if needed using the `-p` flag.

### Build the Site

To build your site into the `public` folder:

```bash
helix-static-gen build
```

This will process your templates, apply layouts, and generate static HTML files.

## Example

Here is a basic example of how to use Helix:

1. Initialize your project:

   ```bash
   helix-static-gen init
   ```

2. Create a Markdown file in the `pages` directory:

   ```markdown
   # Welcome to My Site

   This is my awesome site powered by Helix!
   ```

3. Start the development server:

   ```bash
   helix-static-gen start
   ```

4. Open your browser and navigate to `http://localhost:3000` to see your site in action.

## Docs

[Read the full documentation](https://melvinjmani.github.io/helix) for detailed guides, API references, and more examples.

## Authors

- **Melvin Joseph Mani** - *Initial work* - [melvinjmani](https://github.com/melvinjmani)

## License

Helix is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
