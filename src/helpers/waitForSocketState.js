const waitForSocketState = (socket, state) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (socket.readyState === state) {
        resolve()
      } else {
        waitForSocketState(socket, state).then(resolve)
      }
    }, 0)
  })

module.exports = waitForSocketState
