module.exports = {
  logCacheStatus: function(requestParams, response, context, ee, next) {
    if (response.body) {
      const body = JSON.parse(response.body)
      console.log(`Cache status: ${body.cached ? 'HIT' : 'MISS'}`)
    }
    return next()
  }
}
