import fse from "fs-extra";
import path from "path";
import ejs from "ejs";
import { marked } from "marked";
import frontMatter from "front-matter";
import * as glob from "glob";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import log from "../utils/logger.js";
import parseOptions from "../utils/parser.js";

// Create DOMPurify instance
const window = new JSDOM("").window;
const purify = DOMPurify(window);

/**
 * Normalize slug
 */
const _slug = (file) => {
	return file.split(path.sep).join("-");
};

/**
 * Normalize file path into a URL
 */
const _normalizePath = (file, url = "") => {
	return `${url}/${file.replace(/(index)?.(ejs|htm|html|md)$/, "")}`.replace(
		/\/$/,
		"",
	);
};

/**
 * Returns an object with the entire website indexed and organized by tags
 */
const _indexSitePages = (files, { srcPath }) => {
	// index individual pages
	const pages = files.map((file) => {
		const pageData = frontMatter(
			fse.readFileSync(`${srcPath}/pages/${file}`, "utf-8"),
		);
		const pageSlug = _slug(file);

		return {
			slug: pageSlug,
			tags: pageData.attributes.tags || [],
			title: pageData.attributes.title || "",
			subtitle: pageData.attributes.subtitle || "",
			description: pageData.attributes.description || "",
			keywords: pageData.attributes.keywords || [],
			lastModifiedAt: pageData.attributes.lastModifiedAt || "",
			url: _normalizePath(file),
		};
	});

	// index by tags
	const tags = pages
		.map((page) => page.tags)
		.flat()
		.map((tag) => {
			const tagPages = pages.filter((page) => page.tags.includes(tag));

			return {
				slug: _slug(tag),
				title: tag,
				pages: tagPages,
			};
		});

	return {
		pages,
		tags,
	};
};

/**
 * Build a sitemap XML file
 */
const _buildSiteMap = (files, { url, outputPath }, domain = "") => {
	const xml = [];

	xml.push('<?xml version="1.0" encoding="UTF-8"?>');
	xml.push(
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
	);

	files.forEach((file) => {
		xml.push("\t<url>");
		xml.push(`\t\t<loc>${domain}${_normalizePath(file, url)}</loc>`);
		xml.push(`\t\t<lastmod>${new Date().toISOString()}</lastmod>`);
		xml.push("\t</url>");
	});

	xml.push("</urlset>");

	// save the sitemap file
	fse.writeFileSync(`${outputPath}/sitemap.xml`, xml.join("\n"));
};

/**
 * Build the site
 */
const build = (options = {}) => {
	log.info("Building site...");
	/* eslint-disable-next-line no-undef */
	const startTime = process.hrtime();

	const { srcPath, outputPath, cleanUrls, site } = parseOptions(options);

	// Copy assets folder
	if (fse.existsSync(path.join(srcPath, "assets"))) {
		fse.copySync(path.join(srcPath, "assets"), outputPath);
	}

	// Read pages
	const files = glob.sync("**/*.@(md|ejs|html)", {
		cwd: path.join(srcPath, "pages"),
	});

	//Auto generated sitemap.xml and indexed website content
	_buildSiteMap(files, { url: site.url, outputPath }, site.domain);

	site.index = _indexSitePages(files, { srcPath });

	files.forEach((file) =>
		_buildPage(file, { srcPath, outputPath, cleanUrls, site }),
	);

	// Display build time
	/* eslint-disable-next-line no-undef */
	const timeDiff = process.hrtime(startTime);
	const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
	log.success(`Site built successfully in ${duration}ms`);
};

/**
 * Loads a layout file
 */
const _loadLayout = (layout, { srcPath }) => {
	const file = path.join(srcPath, "layouts", `${layout}.ejs`);
	const data = fse.readFileSync(file, "utf-8");
	return { file, data };
};

/**
 * Build a single page
 */
const _buildPage = (file, { srcPath, outputPath, cleanUrls, site }) => {
	const fileData = path.parse(file);
	let destPath = path.join(outputPath, fileData.dir);
	let urlPath = path.posix.join(fileData.dir, "/");

	// add extra dir level if generating clean URLs and filename is not index
	if (cleanUrls && fileData.name !== "index") {
		destPath = path.join(destPath, fileData.name);
		urlPath = path.posix.join(fileData.dir, fileData.name, "/");
	} else if (!cleanUrls && fileData.name !== "index") {
		urlPath = path.posix.join(fileData.dir, `${fileData.name}.html`);
	}

	// Create destination directory
	fse.mkdirsSync(destPath);

	// Read page file
	const data = fse.readFileSync(path.join(srcPath, "pages", file), "utf-8");

	// Render page
	const pageData = frontMatter(data);
	const templateConfig = {
		site,
		page: pageData.attributes,
		path: urlPath === "/" ? "/" : `/${urlPath}`,
	};

	let pageContent;
	const pageSlug = _slug(file);

	// Generate page content according to file type
	switch (fileData.ext) {
		case ".md": {
			pageContent = marked(pageData.body);
			break;
		}
		case ".ejs": {
			pageContent = ejs.render(pageData.body, templateConfig, {
				filename: path.join(srcPath, `page-${pageSlug}`),
			});
			break;
		}
		default:
			pageContent = pageData.body;
	}

	// Sanitize page content
	const sanitizedContent = purify.sanitize(pageContent);

	// Render layout with page contents
	const layoutName = pageData.attributes.layout || "default";
	const layout = _loadLayout(layoutName, {
		srcPath,
	});

	const completePage = ejs.render(
		layout.data,
		Object.assign({}, templateConfig, {
			body: sanitizedContent,
			filename: path.join(srcPath, `layout-${layoutName}`),
			pagename: `${fileData.dir}${path.sep}${fileData.name}`,
		}),
	);

	// Save the HTML file
	const outputFile = cleanUrls
		? path.join(destPath, "index.html")
		: path.join(destPath, `${fileData.name}.html`);
	fse.writeFileSync(outputFile, completePage);
};

export default build;
