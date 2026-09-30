"use client"

// Nextra 4.6.1 stamps every page with the same wrong "Last updated" date
// (https://github.com/shuding/nextra/issues/4963), so the date is hidden.
// Remove this and Layout's lastUpdated prop once a Nextra release includes
// https://github.com/shuding/nextra/pull/4972.
const NoLastUpdated = () => null

export default NoLastUpdated
