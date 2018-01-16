import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

//jest auto-mocking is incompatible with babel es6/jsx transforms :-(
// https://github.com/babel/babel-jest/issues/16
const App = require('../app').default

describe('App', () => {

  it('greets the user', () => {
    let component = TestUtils.renderIntoDocument(<App />)
    let node = ReactDOM.findDOMNode(component)

    expect(node.textContent).toBe('Hello, world!')
  })

})
