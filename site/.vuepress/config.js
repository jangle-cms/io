module.exports = {
  title: 'Jangle',
  description: 'a cms for humans.',
  head: [
    [
      'link', {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Source+Code+Pro:300,600|Source+Sans+Pro:300,300i,600,600i'
      }
    ],
    [ 'link', { rel: 'icon', href: '/favicon.png' } ]
  ],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      {
        text: 'Docs', items: [
          { text: 'Jangle Core', link: '/docs/core/' },
          { text: 'Jangle API', link: '/docs/api/' },
        ]
      }
    ],
    sidebar: 'auto',
    docsRepo: 'jangle-cms/io',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
  }
}
