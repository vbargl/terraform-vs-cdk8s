import { appendFile, dataDir, truncate, urlFilter } from '../src/utils';
import { test } from '@playwright/test';
import { NodeHtmlMarkdown } from 'node-html-markdown';

test('scrape-terra', async ({ page }) => {
  const baseUrl = 'https://developer.hashicorp.com/terraform';
  const linksFile = `${dataDir}/terraform-links.txt`;
  const markdownFile = `${dataDir}/terraform-content.md`;

  const nhm = new NodeHtmlMarkdown();
  const unvisitedLinks = new Set([baseUrl]);
  const visitedLinks = new Set();

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
    const links = await page.$$eval(`a`, urlFilter, baseUrl);

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
