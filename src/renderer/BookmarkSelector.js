import React from 'react'
var logger = require('./services/logger')

export default class BookmarkSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      copyIcon: null,
      selectedId: null
    }
    this.onDelete = this.onDelete.bind(this)
    this.onMoveBookmark = this.onMoveBookmark.bind(this)
    this.onSelectBookmark = this.onSelectBookmark.bind(this)
  }
  onMoveBookmark (evt, item, dir) {
    evt.stopPropagation()
    this.props.update(this.props.messages.MOVE_BOOKMARK, { id: item.id, dir })
  }
  onDelete (evt, item) {
    evt.stopPropagation()
    this.props.update(this.props.messages.DELETE_BOOKMARK, item.id)
  }
  onSelectBookmark (item) {
    this.props.update(this.props.messages.SELECT_CLIP, item) // side-effect. always honor request
    if (this.state.selectedId === item.id) {
      return logger.info(`skipped, already selected: ${item.id}`)
    }
    this.setState({ selectedId: item.id })
    var uniqueKey = this._clipAnimationHash = Math.random().toString().substr(0, 10)
    var ensureActionOnSameItem = (key, fn) => {
      if (this._clipAnimationHash !== key) return
      fn()
    }
    setTimeout(() => ensureActionOnSameItem(uniqueKey, () => this.setState({ copyIcon: 'thumbs-ok' })), 100)
    setTimeout(() => ensureActionOnSameItem(uniqueKey, () => this.setState({ copyIcon: null })), 800)
    setTimeout(() => ensureActionOnSameItem(uniqueKey, () => this.setState({ selectedId: null })), 1000)
  }
  render () {
    var { bookmarks } = this.props
    var { copyIcon, selectedId } = this.state
    return (
      <div className='content'>
        <div className='bookmark-table'>
          {
            bookmarks.reverse().map(item => (
              <div id={`clip_${item.id}`} key={item.id} className='clip-row' onClick={() => this.onSelectBookmark(item)}>
                <span className={`clip-item ${selectedId === item.id ? 'bookmark-onselect' : ''}`}>
                  <span className={`clip-item-icon clip-item-icon-bookmark typcn typcn-${(selectedId === item.id) ? (copyIcon || 'bookmark') : 'bookmark'}`} />
                  <span className='clip-item-content'>{item.string}</span>
                  <span onClick={evt => this.onMoveBookmark(evt, item, 1)} className='clip-item-icon clip-item-icon-arrow clip-item-icon-arrow-up typcn typcn-arrow-up-outline' />
                  <span onClick={evt => this.onMoveBookmark(evt, item, -1)} className='clip-item-icon clip-item-icon-arrow clip-item-icon-arrow-down typcn typcn-arrow-down-outline' />
                  <span onClick={evt => this.onDelete(evt, item)} className='clip-item-icon clip-item-icon-delete typcn typcn-times-outline clip-item-last' />
                </span>
              </div>
            ))
          }
          {
            bookmarks.length ? null : (
              <div className='no-clips'>No bookmarks yet!</div>
            )
          }
        </div>
      </div>
    )
  }
}
