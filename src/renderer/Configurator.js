import React from 'react'
import startCase from 'lodash/startCase'

export default class ClipSelector extends React.Component {
  onChange (item) {
    this.props.update(this.props.messages.UPDATE_CONFIGURATION, item)
  }
  render () {
    var { config = {} } = this.props
    var { nonsense = true, saveHistory = true } = config
    return (
      <div className='content'>
        <table className='configuration-table'>
          <tbody>
            {
              [{ name: 'nonsense', value: nonsense }, { name: 'saveHistory', value: saveHistory }].map(item => (
                <tr>
                  <td className='key'>
                    {startCase(item.name)}
                  </td>
                  <td>
                    <input type='checkbox' checked={item.value} onChange={() => this.onChange(item)} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}
