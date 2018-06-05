module.exports = {
  title: 'Jangle',
  description: 'a cms for humans.',
  head: [
    [ 'link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Source+Code+Pro:300,600|Source+Sans+Pro:300,300i,600,600i'
    }],
    [ 'style', { type: 'text/css' }, `
      body {  font-family: "Source Sans Pro", sans-serif !important; }
    `]
  ],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Docs', items: [
        { text: 'Jangle API', link: '/docs/api/' }
       ] }
    ],
    docsRepo: 'jangle-cms/io',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
  }
}
