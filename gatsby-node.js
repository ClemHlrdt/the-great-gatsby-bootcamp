// file to generate slugs and blog post pages
const path = require('path')

module.exports.onCreateNode = ({ node, actions }) => {
  // when a node is created...
  const { createNodeField } = actions
  /* 
    for file with internal type === MarkdownRemark, 
    We create a slug 
  */
  if (node.internal.type === "MarkdownRemark") {
    const slug = path.basename(node.fileAbsolutePath, '.md');
    createNodeField({
        node,
        name: 'slug',
        value: slug
    })
  }
}

module.exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    // 1. Get path to template
    const blogTemplate = path.resolve('./src/templates/blog.js');
    // 2. Get markdown data
    const response = await graphql(`
      query {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `);
    // 3. Create new pages
    response.data.allMarkdownRemark.edges.forEach((edge) => {
        createPage({
            component: blogTemplate,                    // pass the template
            path: `/blog/${edge.node.fields.slug}`,     // create a pathname
            context: {
                slug: edge.node.fields.slug             // pass some context info
            }
        })
    })
}