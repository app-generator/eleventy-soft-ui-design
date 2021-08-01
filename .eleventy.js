const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const PrismicDOM = require('prismic-dom')
const { DateTime } = require('luxon')
const readingTime = require('eleventy-plugin-reading-time')
const Image = require('@11ty/eleventy-img')
const sharp = require('sharp')

const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')
const shortcodes = require('./utils/shortcodes.js')
const iconsprite = require('./utils/iconsprite.js')

const Elements = PrismicDOM.RichText.Elements

const htmlSerializer = function (type, element) {
    switch (type) {
        case Elements.embed:
            return `
        <div data-oembed="${element.oembed.embed_url}"
          data-oembed-type="${element.oembed.type}"
          data-oembed-provider="${element.oembed.provider_name}">
          ${element.oembed.html}
        </div>`
        default:
            return null
    }
}

module.exports = function (eleventyConfig) {
    // Plugins
    eleventyConfig.addPlugin(pluginRss)
    eleventyConfig.addPlugin(pluginNavigation)
    eleventyConfig.addPlugin(readingTime)

    // Filters
    Object.keys(filters).forEach((filterName) => {
        eleventyConfig.addFilter(filterName, filters[filterName])
    })

    eleventyConfig.addNunjucksFilter('prismicHtml', function (value) {
        return PrismicDOM.RichText.asHtml(
            value,
            (doc) => doc.uid,
            htmlSerializer
        )
    })

    eleventyConfig.addNunjucksFilter('prismicText', function (value) {
        return PrismicDOM.RichText.asText(value)
    })

    eleventyConfig.addNunjucksFilter('prismicImage', function ({ url, alt }) {
        const altAttribute = (altText) => {
            if (!altText) return ''
            return `alt="${altText}"`
        }

        return `<img src="${url}" ${altAttribute(alt)} />`
    })

    eleventyConfig.addNunjucksFilter('prismicDate', function (dateString) {
        return PrismicDOM.Date(dateString)
    })

    eleventyConfig.addNunjucksFilter('JSONstringify', function (value) {
        return `<pre>${JSON.stringify(value, undefined, 2)}</pre>`
    })

    eleventyConfig.addFilter('excerpt', (post) => {
        const content = post.replace(/(<([^>]+)>)/gi, '')
        return content.substr(0, content.lastIndexOf(' ', 200)) + '...'
    })

    eleventyConfig.addFilter('postDate', (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL)
    })

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        eleventyConfig.addTransform(transformName, transforms[transformName])
    })

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
    })

    eleventyConfig.addNunjucksAsyncShortcode('Image', async (src, alt) => {
        if (!alt) {
            throw new Error(`Missing \`alt\` on myImage from: ${src}`)
        }

        let stats = await Image(src, {
            widths: [25, 320, 640, 960, 1200, 1800, 2400],
            formats: ['jpeg', 'webp'],
            urlPath: '/images/',
            outputDir: './dist/images/'
        })

        let lowestSrc = stats['jpeg'][0]

        const placeholder = await sharp(lowestSrc.outputPath)
            .resize({ fit: sharp.fit.inside })
            .blur()
            .toBuffer()

        const base64Placeholder = `data:image/png;base64,${placeholder.toString(
            'base64'
        )}`

        const srcset = Object.keys(stats).reduce(
            (acc, format) => ({
                ...acc,
                [format]: stats[format].reduce(
                    (_acc, curr) => `${_acc} ${curr.srcset} ,`,
                    ''
                )
            }),
            {}
        )

        const source = `<source type="image/webp" data-srcset="${srcset['webp']}" >`

        const img = `<img
                        class="img-fluid lazy"
                        alt="${alt}"
                        src="${base64Placeholder}"
                        data-src="${lowestSrc.url}"
                        data-sizes='(min-width: 1024px) 1024px, 100vw'
                        data-srcset="${srcset['jpeg']}"
                        width="${lowestSrc.width}"
                        height="${lowestSrc.height}">`
        return `<div class="image-wrapper"><picture> ${source} ${img} </picture></div>`
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
