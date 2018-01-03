import React, { PureComponent } from 'react'
import Nav from './Nav'
import ClipSelector from './ClipSelector'
import BookmarkSelector from './BookmarkSelector'
import Configurator from './Configurator'

class App extends PureComponent {
  render () {
    const { route } = this.props
    let body
    switch (route) {
      case '/bookmarks':
        body = <BookmarkSelector {...this.props} />
        break
      case '/config':
        body = <Configurator {...this.props} />
        break
      default:
        body = <ClipSelector {...this.props} />
        break
    }
    return (
      <div className='root'>
        <Nav route={this.props.route} update={this.props.update} messages={this.props.messages} />
        {body}
      </div>
    )
  }
}

export default App
