import { truncate, appendFile, dataDir } from "../src/utils";
import { test } from '@playwright/test';
import { NodeHtmlMarkdown } from 'node-html-markdown';

test('scrape-cdk8s', async ({ page }) => {

  const baseUrl = 'https://cdk8s.io/docs/latest';
  const linksFile = `${dataDir}/cdk8s-links.txt`;
  const markdownFile = `${dataDir}/cdk8s-content.md`;

  const nhm = new NodeHtmlMarkdown();
  const unvisitedLinks = new Set([baseUrl]);
  const visitedLinks = new Set([
    // Exclude the following links from the scraping process
    "https://cdk8s.io/docs/latest/LICENSE",
  ]);

  async function scrapeLinks(url: string) {
    url = url.split('#')[0]; // Remove the hash part
    url = url.split('?')[0]; // Remove the query part
    url = url.replace(/\/$/, ''); // Remove trailing slash

    if (visitedLinks.has(url)) {
      return;
    }

    // Mark the URL as visited
    visitedLinks.add(url);
    await appendFile(linksFile, `${url}\n`);

    await page.goto(url);
    const links = await page.$$eval(`a[href^="${baseUrl}"]`, (anchors: HTMLAnchorElement[]) => {
      return anchors.map(anchor => anchor.href);
    });

    // Handle links
    const filteredLinks = links.filter(link => !visitedLinks.has(link));
    console.log(`Found ${filteredLinks.length} on ${url}`);
    filteredLinks.forEach(link => unvisitedLinks.add(link));

    // Convert page content to Markdown and append to file
    const content = await page.content();
    const markdownContent = nhm.translate(content);
    await appendFile(markdownFile, markdownContent);
  }

  await truncate(linksFile);
  await truncate(markdownFile);

  while (unvisitedLinks.size > 0) {
    const link = unvisitedLinks.values().next().value;
    unvisitedLinks.delete(link);
    await scrapeLinks(link);
  }
});


