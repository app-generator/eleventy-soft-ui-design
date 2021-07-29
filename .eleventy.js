const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const PrismicDOM = require('prismic-dom')

const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')
const shortcodes = require('./utils/shortcodes.js')
const iconsprite = require('./utils/iconsprite.js')

module.exports = function (eleventyConfig) {
    // Plugins
    eleventyConfig.addPlugin(pluginRss)
    eleventyConfig.addPlugin(pluginNavigation)

    // Filters
    Object.keys(filters).forEach((filterName) => {
        eleventyConfig.addFilter(filterName, filters[filterName])
    })

    eleventyConfig.addNunjucksFilter('prismicHtml', function (value) {
        return PrismicDOM.RichText.asHtml(value)
    })

    eleventyConfig.addNunjucksFilter('prismicText', function (value) {
        return PrismicDOM.RichText.asText(value)
    })

    eleventyConfig.addNunjucksFilter('JSONstringify', function (value) {
        return `<pre>${JSON.stringify(value, undefined, 2)}</pre>`
    })

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        eleventyConfig.addTransform(transformName, transforms[transformName])
    })

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
    })

    // Icon Sprite
    eleventyConfig.addNunjucksAsyncShortcode('iconsprite', iconsprite)

    // Asset Watch Targets
    eleventyConfig.addWatchTarget('./src/assets')

    // Markdown
    eleventyConfig.setLibrary(
        'md',
        markdownIt({
            html: true,
            breaks: true,
            linkify: true,
            typographer: true
        })
    )

    // Layouts
    eleventyConfig.addLayoutAlias('base', 'base.njk')
    eleventyConfig.addLayoutAlias('post', 'post.njk')

    // Pass-through files
    eleventyConfig.addPassthroughCopy('src/robots.txt')
    eleventyConfig.addPassthroughCopy('src/site.webmanifest')
    eleventyConfig.addPassthroughCopy({ 'src/assets/favicon': '/' })
    eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': '/fonts' })
    eleventyConfig.addPassthroughCopy({ 'src/assets/img': 'assets/img' })
    eleventyConfig.addPassthroughCopy({ 'src/assets/css': '/assets/css' })
    eleventyConfig.addPassthroughCopy({ 'src/assets/js': '/assets/js' })

    // Deep-Merge
    eleventyConfig.setDataDeepMerge(true)

    // Base Config
    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data'
        },
        passthroughFileCopy: true,
        templateFormats: ['njk', 'md', '11ty.js'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    }
}
