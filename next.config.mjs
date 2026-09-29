import nextra from 'nextra'
import slate from './code-theme.mjs'

const withNextra = nextra({
  mdxOptions: {
    rehypePrettyCodeOptions: {
      theme: { light: slate, dark: slate }
    }
  }
})

export default withNextra({
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/', destination: '/introduction', permanent: false }]
  }
})
