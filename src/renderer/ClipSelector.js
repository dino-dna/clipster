import React from 'react'
import FlipMove from 'react-flip-move'
var logger = require('./services/logger')

export default class ClipSelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      copyIcon: null,
      selectedId: null
    }
    this.onBookmark = this.onBookmark.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onSelectClip = this.onSelectClip.bind(this)
    this.onMoveClip = this.onMoveClip.bind(this)
  }
  onBookmark (evt, item) {
    evt.stopPropagation()
    this.props.update(this.props.messages.BOOKMARK_CLIP, item)
  }
  onDelete (evt, item) {
    evt.stopPropagation()
    this.props.update(this.props.messages.DELETE_CLIP, item.id)
  }
  onMoveClip (evt, item, dir) {
    evt.stopPropagation()
    this.props.update(this.props.messages.MOVE_CLIP, { id: item.id, dir })
  }
  onSelectClip (item) {
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
    var { history } = this.props
    var { copyIcon, selectedId } = this.state
    return (
      <div className='content'>
        <div className='clip-table'>
          <FlipMove duration={200} easing='ease-in-out'>
            {
              history.map(item => (
                <div id={`clip_${item.id}`} key={item.id} className='clip-row' onClick={() => this.onSelectClip(item)}>
                  <span className={`clip-item ${selectedId === item.id ? 'clip-item-onselect' : ''}`}>
                    <span className={`clip-item-icon clip-item-icon-copy typcn typcn-${(selectedId === item.id) ? (copyIcon || 'tabs-outline') : 'tabs-outline'}`} />
                    <span className='clip-item-content'>{item.string}</span>
                    <span onClick={evt => this.onMoveClip(evt, item, -1)} className='clip-item-icon clip-item-icon-arrow clip-item-icon-arrow-up typcn typcn-arrow-up-outline' />
                    <span onClick={evt => this.onMoveClip(evt, item, 1)} className='clip-item-icon clip-item-icon-arrow clip-item-icon-arrow-down typcn typcn-arrow-down-outline' />
                    <span onClick={evt => this.onBookmark(evt, item)} className='clip-item-icon clip-item-icon-bookmark typcn typcn-bookmark' />
                    <span onClick={evt => this.onDelete(evt, item)} className='clip-item-icon clip-item-icon-delete typcn typcn-times-outline clip-item-last' />
                  </span>
                </div>
              ))
            }
          </FlipMove>
          {
            history.length ? null : (
              <div className='no-clips'>No content copied, yet!</div>
            )
          }
        </div>
      </div>
    )
  }
}
