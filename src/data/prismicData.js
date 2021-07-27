require('dotenv').config({
    path: `.env`
})
const Prismic = require('@prismicio/client')

const prismicRepoURL = process.env.PRISMIC_REPOSITORY_NAME
const client = Prismic.client(prismicRepoURL)

async function getPrismicData() {
    if (!prismicRepoURL) {
        throw new Error(
            'PRISMIC_REPO_URL not found in .env file or Netlify enviromental variable'
        )
    }

    return client.query('').then(
        function (response) {
            return response.results
        },
        function (err) {
            console.log(`Couldn't fetch Prismic data:`, err)
        }
    )
}

function sortDataByType(data) {
    let dataByType = {}
    for (let item of data) {
        if (!dataByType[item.type]) dataByType[item.type] = []
        dataByType[item.type].push(item)
    }
    return dataByType
}

module.exports = async function () {
    const prismicData = await getPrismicData()
    return sortDataByType(prismicData)
}
