const axios = require('axios');
const convert = require('xml-js')

const redis = require('redis')
const client = redis.createClient()
const { promisify } = require('util')
const setAsync = promisify(client.set).bind(client)

const arxivFetch = async () => {
    
    const authors = [ // THIS IS A LIST OF ALL C&O FACULTY AT WATERLOO. CAN BE ARBITRARILY CHANGED TO MATCH ANY COLLECTION OF AUTHORS REQUIRED.
        "Walaa Moursi",
        "Stephen Vavasis",
        "Levent Tuncel",
        "Chris Ghodsil",
        "Jane Gao",
        "Luke Postle",
        "Peter Nelson",
        "Bruce Richter",
        "Sophie Spirkl",
        "Penny Haxell",
        "Bertrand Guenin",
        "Jim Geelen",
        "Joseph Cheriyan",
        "Bill Cook",
        "Bill Cunningham",
        "Ricardo Fukusawa",
        "Jochen Koenemann",
        "Kanstantsin Pashkovich",
        "Chaitanya Swamy",
        "David Jao",
        "Alfred Menezes",
        "Michele Mosca",
        "Douglas Stebila",
        "Michael Best",
        "Tom Coleman",
        "Henry Wolkowicz",
        "Logan Crew",
        "Ian Goulden",
        "David Jackson",
        "Olya Mandelshtam",
        "Stephen Melczer",
        "Oliver Pechenik",
        "Kevin Purbhoo",
        "Bruce Richmond",
        "David Wagner",
        "Karen Yeats",
        "Debbie Leung",
        "Ashwin Nayak",
        "Jon Yard",
        "David Gosset"
    ]
    
    transformedAuthors = authors.map(str => str.split(" ").join("%20")) // Replace spaces with %20 for search URL purposes.
    
    const authorPromises = transformedAuthors.map(transformedAuthor => axios.get(`http://export.arxiv.org/api/query?search_query=au:${transformedAuthor}+AND+%28cat:math.OC+OR+cat:math.CO%29&max_results=50`))
    const arrayResolved = Promise.all(authorPromises)
    .then((xmlValues) => {
        const mapped = xmlValues.map(xmlElement => {
            const data = JSON.parse(
                convert.xml2json(xmlElement.data, { compact: true, spaces: 2 }) // arXiv returns XML files, convert to JSON.
            )
            return data.feed.entry // return only the data array
        })

        return mapped.reduce((acc, curr) => acc.concat(curr)) // concatenate the data arrays 
    })
    .catch(err => console.error(err))
    const promisedList = await Promise.resolve(arrayResolved)
    const finalList = promisedList.filter(elem => elem) // remove any null documents
    const transformedFinalList = finalList.map(member => {
        let transformedNewAuthors = []
        try {
            transformedNewAuthors = member.author.map(elem => elem.name._text)
        } catch {
            transformedNewAuthors = [member.author.name._text]
        } // Returns list of author strings.

        let transformedNewCategory = []
        try {
            transformedNewCategory = member.category.map(elem => elem._attributes.term)
        } catch {
            transformedNewCategory = [member.category._attributes.term]
        } // Returns list of arXiv category strings.

        const newMember = {
                href: member.id._text,
                authors: transformedNewAuthors,
                title: member.title._text,
                date: member.published._text,
                category: transformedNewCategory[0],
                summary: member.summary._text
            }
        return newMember
    })

    const today = new Date();
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const prevFormattedMonth = `${mm === '01' ? yyyy - 1 : yyyy}-${mm === '01' ? '12' : today.getMonth()}`
    const formattedMonth = `${yyyy}-${mm}`

    // We filter out documents older than 2 years
    const filteredFinalList = transformedFinalList.filter(elem => {
        const lstMonth = elem.date.substring(0,7)
        return (lstMonth.substring(0,4) === String(yyyy) || lstMonth.substring(0,4) === String(yyyy-1)) && authors.filter(value => elem.authors.includes(value)).length != 0
    })
    
    // We sort the remaning documents by date.
    const sortedFinalList = filteredFinalList.sort((a, b) => {
        const aYear = Number(a.date.substring(0,4))
        const bYear = Number(b.date.substring(0,4))
        const aMonth = Number(a.date.substring(5,7))
        const bMonth = Number(b.date.substring(5,7))

        if(aYear > bYear) {
            return 1
        } else if(aYear < bYear) {
            return -1
        } else if(aMonth > bMonth) {
            return 1
        } else if(aMonth < bMonth) {
            return -1
        } else {
            return 0
        }
    })
    const success = await setAsync('papers', JSON.stringify(sortedFinalList.reverse())) // set the 'papers' key in Redis to store a stringified version of the data
    console.log({ success })
    return filteredFinalList
}

arxivFetch() // Call it once on server initialization
module.exports = arxivFetch

