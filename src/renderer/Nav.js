import React from 'react'

export default function Nav (props) {
  const { update, messages, route } = props
  const buttons = [
    {
      route: '/',
      iconClass: 'typcn-attachment-outline'
    },
    {
      route: '/bookmarks',
      iconClass: 'typcn-bookmark'
    },
    {
      route: '/config',
      iconClass: 'typcn-cog-outline'
    }
  ]
  return (
    <div className='nav'>
      {buttons.map((button, i) => (
        <div
          className={`button-container ${route === button.route ? 'active' : ''}`}
          onClick={() => update(messages.SET_ROUTE, button.route)}
          key={i}>
          <div className={`icon typcn ${button.iconClass}`} />
        </div>
      ))}
    </div>
  )
}
